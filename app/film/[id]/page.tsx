import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { CinemaEvent } from "@/lib/types";
import CommentForm from "./CommentForm";
import { deleteCommentAction } from "@/app/admin/actions";

interface Comment {
  id: number;
  username: string;
  content: string;
  created_at: string;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default async function FilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "authenticated";
  const supabase = getSupabase();

  const [{ data: event }, { data: comments }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).single(),
    supabase
      .from("comments")
      .select("*")
      .eq("event_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!event) notFound();

  const e = event as CinemaEvent;
  const isPast = new Date(e.event_date) < new Date();
  const youtubeId = e.trailer_url ? getYoutubeId(e.trailer_url) : null;

  const eventDate = new Date(e.event_date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <a href="/" className="flex items-center gap-2">
          <span className="font-black text-2xl tracking-tight">
            <span className="text-[#e50914]">KOU</span>
            <span className="text-white/20 mx-1">|</span>
            <span className="text-white font-extralight tracking-[0.2em]">SINE</span>
          </span>
        </a>
        <a href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
          ← Geri
        </a>
      </header>

      {/* Hero - poster arka plan */}
      <div className="relative h-[50vh] overflow-hidden">
        {e.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.poster_url} alt={e.title} className="w-full h-full object-cover opacity-40" />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
        <div className="absolute bottom-8 left-8 md:left-16">
          <p className="text-[#e50914] text-xs font-bold tracking-widest uppercase mb-2">
            {isPast ? "Geçmiş Etkinlik" : "Yaklaşan Etkinlik"}
          </p>
          <h1 className="text-4xl md:text-6xl font-black">{e.title}</h1>
          <p className="text-zinc-400 text-sm mt-2">
            {eventDate} ·{" "}
            {e.map_url ? (
              <a href={e.map_url} target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-2 transition-colors">
                {e.location}
              </a>
            ) : (
              e.location
            )}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 md:px-16 py-10 flex flex-col gap-12">
        {/* Açıklama */}
        {e.description && (
          <p className="text-zinc-300 text-base leading-relaxed">{e.description}</p>
        )}

        {/* Trailer */}
        {youtubeId && (
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-3">
              <span className="w-1 h-5 bg-[#e50914] rounded-full inline-block" />
              Fragman
            </h2>
            <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={e.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Yorumlar - sadece geçmiş etkinlikler */}
        {isPast && (
          <section>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-5 bg-[#e50914] rounded-full inline-block" />
              Yorumlar ({(comments as Comment[])?.length ?? 0})
            </h2>

            <CommentForm eventId={e.id} />

            <div className="mt-8 flex flex-col gap-4">
              {((comments as Comment[]) ?? []).map((c) => (
                <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white text-sm">{c.username}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-600">
                        {new Date(c.created_at).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isAdmin && (
                        <form action={deleteCommentAction}>
                          <input type="hidden" name="id" value={c.id} />
                          <input type="hidden" name="event_id" value={e.id} />
                          <button
                            type="submit"
                            className="text-xs text-zinc-600 hover:text-[#e50914] transition-colors"
                          >
                            Sil
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
