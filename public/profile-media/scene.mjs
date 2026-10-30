import * as THREE from './vendor/three.module.js';

// A gently curved film surface adds camera depth without pretending to reconstruct the filmed site.
export function mountFilm({host, canvas, shots, index = 0, paused = false, motion = true, onState}) {
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:false, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.35 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x23312d, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
  camera.position.set(0, 0, 12);
  const geometry = new THREE.PlaneGeometry(16, 9, 48, 28);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i) / 8, y = positions.getY(i) / 4.5;
    positions.setZ(i, Math.pow((1 - y) / 2, 1.8) * .35 - x * x * .09);
  }
  geometry.computeVertexNormals();
  const pointer = new THREE.Vector2();
  const smooth = new THREE.Vector2();
  let active = index, previous = index, blend = 1, visible = true, disposed = false;
  let request = 0, last = 0, didRender = false, userPaused = paused, depth = motion;
  let lastPlaying = false, lastReady = false;
  const loader = new THREE.TextureLoader();
  const planes = shots.map((shot, i) => {
    const material = new THREE.MeshBasicMaterial({transparent:true, opacity:0, depthWrite:false, depthTest:false, toneMapped:false});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = i === active;
    mesh.userData = {shot, loaded:false, poster:null, video:null, texture:null, aspect:16/9, failed:false};
    scene.add(mesh);
    return mesh;
  });

  function state(playing = false) {
    const ready = didRender;
    if (playing !== lastPlaying || ready !== lastReady) {
      lastPlaying = playing; lastReady = ready;
      onState?.({playing, ready});
    }
  }
  function load(i) {
    const mesh = planes[i], data = mesh.userData;
    if (data.loaded) return;
    data.loaded = true;
    data.poster = loader.load(`/profile-media/${data.shot.id}.webp`, texture => {
      if (disposed) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;
      if (!data.texture || !data.video || data.video.readyState < 2) mesh.material.map = texture;
      mesh.material.needsUpdate = true;
      data.aspect = texture.image.width / texture.image.height;
      resize();
      wake();
    }, undefined, () => { data.failed = true; });
    const video = document.createElement('video');
    video.muted = true; video.defaultMuted = true; video.playsInline = true; video.loop = true;
    video.preload = 'none'; video.setAttribute('playsinline', '');
    video.dataset.profileClip = data.shot.id;
    video.style.display = 'none'; host.appendChild(video); data.video = video;
    video.addEventListener('loadeddata', () => {
      if (disposed) return;
      if (!data.texture) {
        data.texture = new THREE.VideoTexture(video);
        data.texture.colorSpace = THREE.SRGBColorSpace;
        data.texture.minFilter = THREE.LinearFilter;
        data.texture.magFilter = THREE.LinearFilter;
      }
      data.aspect = video.videoWidth / video.videoHeight;
      mesh.material.map = data.texture; mesh.material.needsUpdate = true;
      resize(); wake();
    });
    video.addEventListener('play', () => { if (i === active) state(true); });
    video.addEventListener('pause', () => { if (i === active) state(false); });
    video.addEventListener('error', () => { data.failed = true; if (i === active) state(false); });
  }
  function syncPlayback() {
    planes.forEach((mesh, i) => {
      const video = mesh.userData.video;
      if (!video) return;
      if (i !== active || userPaused || !visible || document.hidden) { video.pause(); return; }
      if (!video.getAttribute('src') && !mesh.userData.failed) video.src = `/profile-media/${mesh.userData.shot.id}.mp4`;
      if (video.paused && !mesh.userData.failed) video.play().catch(() => state(false));
    });
    if (!visible || document.hidden) {
      cancelAnimationFrame(request); request = 0;
    } else wake();
  }
  function resize() {
    if (disposed) return;
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 12;
    const visibleWidth = visibleHeight * camera.aspect;
    planes.forEach(mesh => {
      const aspect = mesh.userData.aspect;
      const scale = Math.max(visibleWidth / (9 * aspect), visibleHeight / 9) * 1.075;
      mesh.scale.set(scale * (aspect / (16/9)), scale, 1);
    });
    wake();
  }
  function frame(time) {
    request = 0;
    if (disposed || !visible || document.hidden) return;
    if (time - last < 32) { request = requestAnimationFrame(frame); return; }
    const delta = Math.min((time - last) / 1000, .1); last = time;
    smooth.lerp(depth ? pointer : new THREE.Vector2(), .065);
    const rect = host.getBoundingClientRect();
    const scroll = depth ? THREE.MathUtils.clamp(rect.top / innerHeight, -1, 1) : 0;
    camera.position.x = smooth.x * .24;
    camera.position.y = -smooth.y * .17 + scroll * .12;
    camera.position.z = 12 - (depth ? .10 * Math.sin(time * .00018) : 0);
    camera.lookAt(smooth.x * .045, -smooth.y * .035, 0);
    if (planes[active].material.map?.image) blend = Math.min(1, blend + delta * 1.7);
    planes.forEach((mesh, i) => {
      mesh.visible = Boolean(mesh.material.map?.image) && (i === active || (i === previous && blend < 1));
      mesh.renderOrder = i === active ? 2 : 1;
      mesh.material.opacity = i === active ? blend : 1;
    });
    renderer.render(scene, camera);
    if (planes[active].material.map?.image && !didRender) { didRender = true; state(Boolean(planes[active].userData.video && !planes[active].userData.video.paused)); }
    if (!userPaused || depth || blend < 1) request = requestAnimationFrame(frame);
  }
  function wake() { if (!request && !disposed && visible && !document.hidden) request = requestAnimationFrame(frame); }
  function move(event) {
    if (!depth) return;
    const rect = host.getBoundingClientRect();
    pointer.set(THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1), THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1));
    wake();
  }
  function leave() { pointer.set(0, 0); wake(); }
  const stage = host.parentElement;
  stage.addEventListener('pointermove', move, {passive:true});
  stage.addEventListener('pointerleave', leave);
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncPlayback(); }, {threshold:.01});
  intersection.observe(host);
  const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(host);
  document.addEventListener('visibilitychange', syncPlayback);
  function contextLost(event) { event.preventDefault(); didRender = false; state(false); }
  canvas.addEventListener('webglcontextlost', contextLost);
  load(active); resize(); syncPlayback();

  return {
    update(options) {
      if (disposed) return;
      userPaused = options.paused; depth = options.motion;
      if (active !== options.index) {
        previous = active; active = options.index; blend = 0;
        load(active);
      }
      syncPlayback(); wake();
    },
    dispose() {
      disposed = true; cancelAnimationFrame(request);
      intersection.disconnect(); sizeObserver.disconnect();
      stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', syncPlayback);
      canvas.removeEventListener('webglcontextlost', contextLost);
      planes.forEach(mesh => {
        const data = mesh.userData;
        if (data.video) { data.video.pause(); data.video.removeAttribute('src'); data.video.load(); data.video.remove(); }
        data.texture?.dispose(); data.poster?.dispose(); mesh.material.dispose();
      });
      geometry.dispose(); renderer.dispose();
    }
  };
}
