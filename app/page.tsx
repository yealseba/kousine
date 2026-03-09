import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
import { CinemaEvent } from "@/lib/types";
import { mockEvents } from "@/lib/mockData";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MovieSlider from "./components/MovieSlider";

async function getEvents(): Promise<CinemaEvent[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true);

    // Supabase bağlantısı yoksa veya hata varsa mock data kullan
    if (error || !data || data.length === 0) return mockEvents;
    return data as CinemaEvent[];
  } catch {
    return mockEvents;
  }
}

export default async function Home() {
  const events = await getEvents();
  const now = new Date();

  const upcomingEvents = events
    .filter((e) => e.is_active && new Date(e.event_date) > now)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

  const pastEvents = events
    .filter((e) => e.is_active && new Date(e.event_date) <= now)
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

  const nextEvent = upcomingEvents[0];

  return (
    <main className="min-h-screen bg-[#141414]">
      <Navbar />

      {nextEvent ? (
        <HeroSection event={nextEvent} />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-zinc-500 text-xl">Yaklaşan etkinlik bulunmuyor.</p>
        </div>
      )}

      {pastEvents.length > 0 && (
        <section className="px-8 md:px-16 py-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-[#e50914] rounded-full inline-block" />
            Geçmiş Etkinlikler
          </h2>
          <MovieSlider events={pastEvents} />
        </section>
      )}

      {upcomingEvents.length > 1 && (
        <section className="px-8 md:px-16 py-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-[#e50914] rounded-full inline-block" />
            Yaklaşan Etkinlikler
          </h2>
          <MovieSlider events={upcomingEvents.slice(1)} />
        </section>
      )}

      <footer className="text-center text-zinc-700 text-xs py-8">
        Sinema Kulübü &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
