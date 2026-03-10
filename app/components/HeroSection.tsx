import { CinemaEvent } from "@/lib/types";
import CountdownTimer from "./CountdownTimer";
import HeroVideo from "./HeroVideo";

const POSTER_COLORS = [
  "from-blue-900 to-indigo-950",
  "from-red-900 to-rose-950",
  "from-emerald-900 to-teal-950",
  "from-purple-900 to-violet-950",
  "from-amber-900 to-orange-950",
];

export default function HeroSection({ event }: { event: CinemaEvent }) {
  const colorClass = POSTER_COLORS[event.id % POSTER_COLORS.length];
  const eventDate = new Date(event.event_date);
  const dateStr = eventDate.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = eventDate.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* Arka plan: trailer varsa video, yoksa poster, yoksa gradient */}
      {event.trailer_url ? (
        <HeroVideo trailerUrl={event.trailer_url} posterUrl={event.poster_url} />
      ) : event.poster_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.poster_url}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-20`} />
      )}

      {/* Karartma katmanları */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-[#141414]/60 md:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

      {/* İçerik */}
      <div className="relative z-10 px-4 md:px-16 max-w-2xl pt-24 pb-16 md:pb-0">
        <p className="text-[#e50914] text-sm font-bold tracking-widest uppercase mb-4">
          Gelecek Etkinlik
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-4">
          {event.title}
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed mb-6 max-w-lg">
          {event.description}
        </p>

        <div className="flex flex-col gap-2 mb-8 text-sm text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="text-[#e50914]">Tarih</span>
            <span>{dateStr} · {timeStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#e50914]">Konum</span>
            {event.map_url ? (
              <a href={event.map_url} target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-2 transition-colors">
                {event.location}
              </a>
            ) : (
              <span>{event.location}</span>
            )}
          </div>
        </div>

        <div className="mb-2">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
            Etkinliğe Kalan Süre
          </p>
          <CountdownTimer targetDate={event.event_date} />
        </div>
      </div>
    </section>
  );
}
