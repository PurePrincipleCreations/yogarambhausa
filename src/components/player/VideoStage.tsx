import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/* Minimal typing for the YouTube IFrame API. */
type YTPlayer = {
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(s: number, allowSeekAhead: boolean): void;
  destroy(): void;
};
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer; PlayerState: { PLAYING: number; ENDED: number } };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

export type VideoStageHandle = { getCurrentTime: () => number };

type Props = {
  videoUrl: string;
  lessonId: string;
  userId: string | undefined;
  title: string;
  onProgress?: () => void;
};

const SAVE_EVERY_MS = 10_000;

export const VideoStage = forwardRef<VideoStageHandle, Props>(function VideoStage(
  { videoUrl, lessonId, userId, title, onProgress },
  ref,
) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const completed = useRef(false);
  const videoId = videoUrl.split("/embed/")[1]?.split(/[?&]/)[0] ?? "";

  useImperativeHandle(ref, () => ({ getCurrentTime: () => player.current?.getCurrentTime() ?? 0 }), []);

  useEffect(() => {
    if (!host.current || !videoId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;
    completed.current = false;

    const save = async (force = false) => {
      const p = player.current;
      if (!p || !userId) return;
      const watched = Math.floor(p.getCurrentTime());
      const total = Math.floor(p.getDuration());
      if (!total || (watched === 0 && !force)) return;
      const done = completed.current || watched >= total * 0.95;
      const row: { user_id: string; lesson_id: string; watched_seconds: number; total_seconds: number; updated_at: string; is_completed?: boolean } = {
        user_id: userId, lesson_id: lessonId, watched_seconds: watched, total_seconds: total, updated_at: new Date().toISOString(),
      };
      // Only ever flip to completed automatically; never un-complete here.
      if (done && !completed.current) { row.is_completed = true; completed.current = true; }
      await supabase.from("video_progress").upsert(row, { onConflict: "user_id,lesson_id" });
      onProgress?.();
    };

    (async () => {
      const [, progress] = await Promise.all([
        loadApi(),
        userId
          ? supabase.from("video_progress").select("watched_seconds, total_seconds, is_completed").eq("lesson_id", lessonId).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      if (cancelled || !host.current || !window.YT) return;
      const saved = progress.data;
      completed.current = !!saved?.is_completed;
      const mount = document.createElement("div");
      host.current.replaceChildren(mount);
      player.current = new window.YT.Player(mount, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => {
            const resumeAt = saved?.watched_seconds ?? 0;
            const total = saved?.total_seconds ?? 0;
            if (resumeAt > 5 && (!total || resumeAt < total * 0.95)) player.current?.seekTo(resumeAt, true);
          },
          onStateChange: (e: { data: number }) => {
            const S = window.YT!.PlayerState;
            if (e.data === S.PLAYING && !timer) timer = setInterval(() => void save(), SAVE_EVERY_MS);
            if (e.data !== S.PLAYING && timer) { clearInterval(timer); timer = null; void save(); }
          },
        },
      });
    })();

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      void save();
      player.current?.destroy();
      player.current = null;
    };
  }, [videoId, lessonId, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={host} title={title} className="size-full [&_iframe]:size-full [&_iframe]:border-0" />;
});

export function formatStamp(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}
