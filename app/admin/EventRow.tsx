"use client";

import { CinemaEvent } from "@/lib/types";
import { deleteEventAction, toggleActiveAction } from "./actions";

export default function EventRow({ event }: { event: CinemaEvent }) {
  const date = new Date(event.event_date);
  const isPast = date < new Date();
  const dateStr = date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-14 rounded bg-zinc-800 flex-shrink-0 overflow-hidden">
          {event.poster_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-700" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{event.title}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{dateStr} · {event.location}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          isPast ? "bg-zinc-800 text-zinc-500"
          : event.is_active ? "bg-green-900/50 text-green-400"
          : "bg-zinc-800 text-zinc-500"
        }`}>
          {isPast ? "Geçmiş" : event.is_active ? "Aktif" : "Gizli"}
        </span>

        <a
          href={`/admin/duzenle/${event.id}`}
          className="text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors"
        >
          Düzenle
        </a>

        <form action={toggleActiveAction}>
          <input type="hidden" name="id" value={event.id} />
          <input type="hidden" name="is_active" value={String(event.is_active)} />
          <button type="submit" className="text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors">
            {event.is_active ? "Gizle" : "Yayınla"}
          </button>
        </form>

        <form action={deleteEventAction} onSubmit={(e) => {
          if (!confirm(`"${event.title}" silinsin mi?`)) e.preventDefault();
        }}>
          <input type="hidden" name="id" value={event.id} />
          <button type="submit" className="text-xs text-zinc-400 hover:text-[#e50914] border border-zinc-700 hover:border-[#e50914] px-3 py-1.5 rounded-lg transition-colors">
            Sil
          </button>
        </form>
      </div>
    </div>
  );
}
