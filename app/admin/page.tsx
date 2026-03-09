import { createClient } from "@supabase/supabase-js";
import { CinemaEvent } from "@/lib/types";

export const dynamic = "force-dynamic";
import { logoutAction, addEventAction } from "./actions";
import DateTimePicker from "@/app/components/DateTimePicker";
import EventRow from "./EventRow";

async function getEvents(): Promise<CinemaEvent[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });
  return (data as CinemaEvent[]) ?? [];
}

export default async function AdminPage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      {/* Navbar */}
      <header className="border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-black text-2xl tracking-tight">
            <span className="text-[#e50914]">KOU</span>
            <span className="text-white/20 mx-1">|</span>
            <span className="text-white font-extralight tracking-[0.2em]">SINE</span>
          </span>
          <span className="text-zinc-600 ml-2 text-sm">· Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Siteye Git
          </a>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-zinc-400 hover:text-[#e50914] transition-colors"
            >
              Çıkış
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col gap-12">
        {/* Yeni Etkinlik Formu */}
        <section>
          <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-5 bg-[#e50914] rounded-full inline-block" />
            Yeni Etkinlik Ekle
          </h2>

          <form
            action={addEventAction}
            encType="multipart/form-data"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400">Film Adı *</label>
              <input
                name="title"
                required
                placeholder="Örn: Stalker"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e50914] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400">Konum *</label>
              <input
                name="location"
                required
                placeholder="Örn: B Blok - 204 Nolu Derslik"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e50914] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm text-zinc-400">Tarih ve Saat *</label>
              <DateTimePicker />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm text-zinc-400">Trailer / Fragman Linki (YouTube)</label>
              <input
                name="trailer_url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e50914] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm text-zinc-400">Google Maps Linki</label>
              <input
                name="map_url"
                type="url"
                placeholder="https://maps.google.com/..."
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e50914] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400">Film Afişi (JPG/PNG)</label>
              <input
                name="poster"
                type="file"
                accept="image/*"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-400 focus:outline-none focus:border-[#e50914] transition-colors file:mr-3 file:bg-zinc-700 file:border-0 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm text-zinc-400">Film Özeti / Kulüp Notu</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Film hakkında kısa bir açıklama..."
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e50914] transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
              <input
                name="is_active"
                type="checkbox"
                defaultChecked
                id="is_active"
                className="w-4 h-4 accent-[#e50914]"
              />
              <label htmlFor="is_active" className="text-sm text-zinc-400">
                Hemen yayınla (sitede görünsün)
              </label>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-[#e50914] hover:bg-[#c40812] text-white font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Etkinlik Ekle
              </button>
            </div>
          </form>
        </section>

        {/* Mevcut Etkinlikler */}
        <section>
          <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-5 bg-[#e50914] rounded-full inline-block" />
            Mevcut Etkinlikler ({events.length})
          </h2>

          {events.length === 0 ? (
            <p className="text-zinc-600 text-sm">Henüz etkinlik eklenmemiş.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

