import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { CinemaEvent } from "@/lib/types";
import { updateEventAction } from "@/app/admin/actions";
import DateTimePicker from "@/app/components/DateTimePicker";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase.from("events").select("*").eq("id", id).single();
  if (!data) notFound();
  const event = data as CinemaEvent;

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <header className="border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-zinc-400 hover:text-white transition-colors text-lg">←</a>
          <span className="font-semibold">Etkinliği Düzenle</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <form
          action={updateEventAction}
          encType="multipart/form-data"
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input type="hidden" name="id" value={event.id} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400">Film Adı *</label>
            <input
              name="title"
              required
              defaultValue={event.title}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e50914] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400">Konum *</label>
            <input
              name="location"
              required
              defaultValue={event.location}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e50914] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm text-zinc-400">Tarih ve Saat *</label>
            <DateTimePicker defaultValue={event.event_date} />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm text-zinc-400">Trailer / Fragman Linki (YouTube)</label>
            <input
              name="trailer_url"
              type="url"
              defaultValue={event.trailer_url ?? ""}
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e50914] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm text-zinc-400">Google Maps Linki</label>
            <input
              name="map_url"
              type="url"
              defaultValue={event.map_url ?? ""}
              placeholder="https://maps.google.com/..."
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e50914] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400">Yeni Afiş (boş bırakırsan eskisi kalır)</label>
            <input
              name="poster"
              type="file"
              accept="image/*"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-400 focus:outline-none focus:border-[#e50914] transition-colors file:mr-3 file:bg-zinc-700 file:border-0 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer"
            />
            {event.poster_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={event.poster_url} alt="Mevcut afiş" className="w-16 h-24 object-cover rounded mt-1 opacity-70" />
            )}
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm text-zinc-400">Film Özeti / Kulüp Notu</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={event.description}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e50914] transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked={event.is_active}
              id="is_active"
              className="w-4 h-4 accent-[#e50914]"
            />
            <label htmlFor="is_active" className="text-sm text-zinc-400">
              Yayında (sitede görünsün)
            </label>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-[#e50914] hover:bg-[#c40812] text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Kaydet
            </button>
            <a
              href="/admin"
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              İptal
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
