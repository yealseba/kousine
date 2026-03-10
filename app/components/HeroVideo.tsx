"use client";

import { useRef, useState } from "react";

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function sendCommand(iframe: HTMLIFrameElement, func: string) {
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args: "" }),
    "*"
  );
}

interface Props {
  trailerUrl: string;
  posterUrl?: string;
}

export default function HeroVideo({ trailerUrl, posterUrl }: Props) {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const youtubeId = getYoutubeId(trailerUrl);

  if (!youtubeId) return null;

  function togglePlay() {
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (playing) {
      sendCommand(iframe, "pauseVideo");
    } else {
      sendCommand(iframe, "playVideo");
    }
    setPlaying(!playing);
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const iframe = iframeRef.current;
    if (!iframe) return;
    sendCommand(iframe, muted ? "unMute" : "mute");
    setMuted(!muted);
  }

  return (
    <>
      {/* Poster - video duruyunca görünür */}
      {posterUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterUrl}
          alt="poster"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-0" : "opacity-50"
          }`}
        />
      )}

      {/* Video */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: "none" }}
      >
        <iframe
          ref={iframeRef}
          className="absolute"
          /* 16:9 video her ekran oranında (dikey dahil) siyah boşluk bırakmadan kaplar */
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "max(100%, 177.78vh)",
            height: "max(100%, 56.25vw)",
            filter: "blur(0.4px)",
          }}
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&playsinline=1&vq=hd720`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>

      {/* Tıklanabilir alan - durdur/oynat */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 z-10 w-full h-full cursor-pointer bg-transparent"
        aria-label={playing ? "Videoyu durdur" : "Videoyu oynat"}
      />

      {/* Durduruldu göstergesi */}
      {!playing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-full p-5 backdrop-blur-sm">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Alt sağ kontroller */}
      <div className="absolute bottom-6 right-4 md:bottom-10 md:right-10 z-20 flex items-center gap-2 md:gap-3">
        {/* Oynat/Durdur */}
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 bg-black/50 hover:bg-black/70 border border-zinc-600 hover:border-white text-white px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm"
        >
          {playing ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              Durdur
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Oynat
            </>
          )}
        </button>

        {/* Ses */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 bg-black/50 hover:bg-black/70 border border-zinc-600 hover:border-white text-white px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm"
        >
          {muted ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
              </svg>
              Sesi Aç
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
              Sesi Kapat
            </>
          )}
        </button>
      </div>
    </>
  );
}
