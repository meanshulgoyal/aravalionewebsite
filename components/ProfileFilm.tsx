"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./ProfileFilm.module.css";

export const profileShots = [
  { id: "quarry", label: "At the source", title: "Where it all begins.", copy: "Mining-linked sourcing and material handling, with accountability from the first load.", detail: "MINING / MATERIAL HANDLING" },
  { id: "movement", label: "In movement", title: "Momentum, with purpose.", copy: "Heavy logistics, planned dispatch and the discipline to keep projects moving.", detail: "LOGISTICS / DISPATCH" },
  { id: "infrastructure", label: "To the site", title: "Built for what comes next.", copy: "Materials and movement for road, rail and industrial infrastructure.", detail: "ROADS / RAIL / INDUSTRY" }
];

type FilmState = { playing: boolean; ready: boolean };
type FilmController = {
  update: (options: { index: number; paused: boolean; motion: boolean }) => void;
  dispose: () => void;
};

export function ProfileFilm({ index = 0, paused, motion, enabled = true, onState }: {
  index?: number;
  paused: boolean;
  motion: boolean;
  enabled?: boolean;
  onState?: (state: FilmState) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<FilmController | null>(null);
  const options = useRef({ index, paused, motion });
  const callback = useRef(onState);
  const [ready, setReady] = useState(false);
  options.current = { index, paused, motion };
  callback.current = onState;

  useEffect(() => { controller.current?.update({ index, paused, motion }); }, [index, paused, motion]);

  useEffect(() => {
    const element = host.current;
    if (!enabled || !element || !canvas.current) return;
    let cancelled = false;
    let started = false;
    const observer = new IntersectionObserver(async entries => {
      if (started || !entries.some(entry => entry.isIntersecting)) return;
      started = true;
      try {
        const moduleUrl = "/profile-media/scene.mjs";
        const scene = await import(/* webpackIgnore: true */ moduleUrl);
        if (cancelled) return;
        controller.current = scene.mountFilm({
          host: element,
          canvas: canvas.current,
          shots: profileShots,
          ...options.current,
          onState(state: FilmState) {
            if (cancelled) return;
            setReady(state.ready);
            callback.current?.(state);
          }
        });
      } catch {
        if (!cancelled) callback.current?.({ playing: false, ready: false });
      }
    }, { rootMargin: "250px 0px" });
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
      controller.current?.dispose();
      controller.current = null;
    };
  }, [enabled]);

  return <div ref={host} className={styles.film} data-film-engine={ready ? "webgl" : "poster"} data-film-index={index} data-film-motion={motion ? "on" : "off"}>
    <Image src={`/profile-media/${profileShots[index].id}.webp`} alt="" fill sizes="100vw" priority={index === 0} className={styles.poster} />
    <canvas ref={canvas} className={`${styles.canvas} ${ready ? styles.ready : ""}`} aria-hidden="true" />
  </div>;
}
