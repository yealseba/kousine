import { NextRequest, NextResponse } from "next/server";

const GENRE_KEYWORDS: Record<string, string[]> = {
  aksiyon: ["action", "war", "adventure", "combat", "hero", "battle", "mission", "fighter"],
  komedi: ["comedy", "funny", "humor", "laugh", "hilarious", "comic", "parody"],
  dram: ["drama", "life", "family", "love", "journey", "story", "woman", "man"],
  korku: ["horror", "terror", "ghost", "fear", "dark", "evil", "haunted", "monster"],
  "bilim-kurgu": ["space", "future", "robot", "alien", "galaxy", "time", "mars", "cyber"],
  animasyon: ["adventure", "magic", "kingdom", "dream", "world", "hero", "quest"],
  gerilim: ["mystery", "crime", "killer", "secret", "trap", "escape", "danger", "revenge"],
};

export async function GET(req: NextRequest) {
  const genre = req.nextUrl.searchParams.get("genre") || "dram";
  const keywords = GENRE_KEYWORDS[genre] || GENRE_KEYWORDS["dram"];
  const apiKey = process.env.OMDB_API_KEY;

  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  const randomPage = Math.floor(Math.random() * 5) + 1;

  // OMDb search ile birden fazla film çek
  const searchRes = await fetch(
    `https://www.omdbapi.com/?s=${encodeURIComponent(randomKeyword)}&type=movie&page=${randomPage}&apikey=${apiKey}`
  );
  const searchData = await searchRes.json();

  if (searchData.Response === "False" || !searchData.Search?.length) {
    return NextResponse.json({ error: "Film bulunamadı" }, { status: 404 });
  }

  // Listeden rastgele bir film seç
  const randomMovie = searchData.Search[Math.floor(Math.random() * searchData.Search.length)];

  // Seçilen filmin detaylarını çek
  const detailRes = await fetch(
    `https://www.omdbapi.com/?i=${randomMovie.imdbID}&apikey=${apiKey}&plot=short`
  );
  const data = await detailRes.json();

  if (data.Response === "False") {
    return NextResponse.json({ error: "Film bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({
    title: data.Title,
    year: data.Year,
    genre: data.Genre,
    plot: data.Plot,
    poster: data.Poster !== "N/A" ? data.Poster : null,
    rating: data.imdbRating,
    runtime: data.Runtime,
    director: data.Director,
    actors: data.Actors,
  });
}
