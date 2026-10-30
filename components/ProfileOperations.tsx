"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { ProfileFilm, profileShots } from "./ProfileFilm";
import styles from "./ProfileOperations.module.css";

export function ProfileOperations({ motion, paused, enabled, onTogglePlayback, onEnquire }: {
  motion: boolean;
  paused: boolean;
  enabled: boolean;
  onTogglePlayback: () => void;
  onEnquire: () => void;
}) {
  const tour = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const element = tour.current;
      if (!element) return;
      const top = innerWidth <= 700 ? 123 : 135;
      const rect = element.getBoundingClientRect();
      const height = element.offsetHeight - (innerHeight - top);
      const value = Math.max(0, Math.min(1, (top - rect.top) / Math.max(1, height)));
      setIndex(Math.min(2, Math.floor(value * 3)));
      progress.current?.style.setProperty("--tour-progress", String(value));
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); };
  }, []);

  function goToChapter(next: number) {
    const element = tour.current;
    if (!element) return;
    const top = innerWidth <= 700 ? 123 : 135;
    const range = element.offsetHeight - (innerHeight - top);
    const target = scrollY + element.getBoundingClientRect().top - top + range * (next + .15) / 3;
    window.scrollTo({ top: target, behavior: motion ? "smooth" : "instant" });
    setIndex(next);
  }

  return <section className={styles.world} id="profile-operations" aria-label="Source to site film">
    <div className={styles.heading}><div><span>THE WORLD WE WORK IN</span><h2>From the ground.<br /><em>To the extraordinary.</em></h2></div><p>At the source. In movement. To the site.<br />One connected approach to execution.</p></div>
    <section ref={tour} className={styles.tour} aria-label="Operations chapters">
      <div className={styles.viewport}>
        <ProfileFilm index={index} motion={motion} paused={paused} enabled={enabled} onState={state => setPlaying(state.playing)} />
        <div className={styles.shade} />
        <div className={styles.topline}><span>ARAVALI ONE / SOURCE TO SITE</span><span>0{index + 1}<i> / 03</i></span></div>
        <div className={styles.chapter} key={index}>
          <span className={styles.kicker}>0{index + 1} / {profileShots[index].detail}</span>
          <h3>{profileShots[index].title}</h3>
          <p>{profileShots[index].copy}</p>
          <button onClick={onEnquire}>Discuss your requirement <ArrowUpRight size={17} /></button>
        </div>
        <div className={styles.bottom}>
          <div className={styles.tabs} aria-label="Film chapters">{profileShots.map((shot, i) => <button key={shot.id} onClick={() => goToChapter(i)} aria-pressed={i === index} className={i === index ? styles.selected : ""}><small>0{i + 1}</small><span>{shot.label}</span></button>)}</div>
          <div className={styles.controls}><span><ArrowDown size={15} />SOURCE TO SITE</span><button onClick={onTogglePlayback} title={paused ? "Play operations film" : "Pause operations film"} aria-label={paused ? "Play operations film" : "Pause operations film"}>{playing && !paused ? <Pause size={17} /> : <Play size={17} />}</button></div>
        </div>
        <div ref={progress} className={styles.progress} aria-hidden="true"><span /></div>
      </div>
    </section>
  </section>;
}
