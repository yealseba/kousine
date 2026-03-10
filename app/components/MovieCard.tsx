import { CinemaEvent } from "@/lib/types";

const POSTER_COLORS = [
  "from-blue-900 to-indigo-950",
  "from-red-900 to-rose-950",
  "from-emerald-900 to-teal-950",
  "from-purple-900 to-violet-950",
  "from-amber-900 to-orange-950",
  "from-cyan-900 to-sky-950",
  "from-pink-900 to-fuchsia-950",
];

export default function MovieCard({ event }: { event: CinemaEvent }) {
  const colorClass = POSTER_COLORS[event.id % POSTER_COLORS.length];
  const eventDate = new Date(event.event_date);
  const dateStr = eventDate.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <a href={`/film/${event.id}`} className="flex-shrink-0 w-36 md:w-44 group/card cursor-pointer">
      {/* Poster */}
      <div
        className={`relative w-36 h-52 md:w-44 md:h-64 rounded-md bg-gradient-to-br ${colorClass} overflow-hidden transition-transform duration-300 group-hover/card:scale-105 group-hover/card:z-10`}
      >
        {event.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.poster_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-end p-3">
            <span className="text-white/30 font-black text-xs uppercase tracking-wider leading-tight">
              {event.title}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2 px-0.5">
        <p className="text-white text-xs font-semibold truncate">{event.title}</p>
        <p className="text-zinc-500 text-xs mt-0.5">{dateStr}</p>
      </div>
    </a>
  );
}
