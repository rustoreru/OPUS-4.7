import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import type { StreamBundle } from "../services/types";
import styles from "./Player.module.css";

interface PlayerProps {
  bundle: StreamBundle | null;
  loading?: boolean;
  error?: string | null;
}

function pickDefaultQuality(qualities: StreamBundle["qualities"]): number {
  if (qualities.length === 0) return 0;
  const priority = ["1080p", "720p", "480p", "360p"];
  for (const p of priority) {
    const idx = qualities.findIndex((q) => q.label.toLowerCase().includes(p));
    if (idx >= 0) return idx;
  }
  return 0;
}

export function Player({ bundle, loading, error }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (bundle?.qualities.length) {
      setActiveIdx(pickDefaultQuality(bundle.qualities));
    }
  }, [bundle]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !bundle?.qualities.length) return;
    const src = bundle.qualities[activeIdx]?.url;
    if (!src) return;

    let hls: Hls | null = null;
    if (src.includes(".m3u8") && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
    return () => {
      hls?.destroy();
    };
  }, [bundle, activeIdx]);

  if (loading) {
    return (
      <div className={styles.wrap}>
        <div className={styles.status}>Загрузка источника…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrap}>
        <div className={`${styles.status} ${styles.error}`}>{error}</div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className={styles.wrap}>
        <div className={styles.status}>Выберите источник для просмотра</div>
      </div>
    );
  }

  if (bundle.iframe) {
    return (
      <div>
        <div className={styles.wrap}>
          <iframe
            className={styles.iframe}
            src={bundle.iframe}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={bundle.sourceTitle}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.wrap}>
        {bundle.qualities.length ? (
          <video
            ref={videoRef}
            className={styles.video}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <div className={`${styles.status} ${styles.error}`}>
            Источник {bundle.sourceTitle} не вернул прямых ссылок
          </div>
        )}
      </div>
      {bundle.qualities.length > 1 && (
        <div className={styles.qualityBar}>
          {bundle.qualities.map((q, idx) => (
            <button
              key={q.label + idx}
              className={`${styles.qualityBtn} ${
                idx === activeIdx ? styles.active : ""
              }`}
              onClick={() => setActiveIdx(idx)}
              type="button"
            >
              {q.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
