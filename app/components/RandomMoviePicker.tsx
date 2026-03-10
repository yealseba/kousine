"use client";

import { useState } from "react";

const GENRES = [
  { id: "aksiyon", label: "Aksiyon" },
  { id: "komedi", label: "Komedi" },
  { id: "dram", label: "Dram" },
  { id: "korku", label: "Korku" },
  { id: "bilim-kurgu", label: "Bilim Kurgu" },
  { id: "animasyon", label: "Animasyon" },
  { id: "gerilim", label: "Gerilim" },
];

interface Movie {
  title: string;
  year: string;
  genre: string;
  plot: string;
  poster: string | null;
  rating: string;
  runtime: string;
  director: string;
  actors: string;
}

export default function RandomMoviePicker() {
  const [selectedGenre, setSelectedGenre] = useState("dram");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchMovie() {
    setLoading(true);
    setMovie(null);
    try {
      const res = await fetch(`/api/random-movie?genre=${selectedGenre}`);
      const data = await res.json();
      if (!data.error) setMovie(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-4 md:px-16 py-12">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-1 h-6 bg-[#e50914] rounded-full inline-block" />
        Bugün Ne İzlesem?
      </h2>

      {/* Tür seçimi */}
      <div className="flex flex-wrap gap-2 mb-6">
        {GENRES.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGenre(g.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedGenre === g.id
                ? "bg-[#e50914] text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Buton */}
      <button
        onClick={fetchMovie}
        disabled={loading}
        className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded hover:bg-zinc-200 transition-colors duration-200 disabled:opacity-50 mb-8"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Aranıyor...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
            Rastgele Film Öner
          </>
        )}
      </button>

      {/* Film kartı */}
      {movie && (
        <div className="flex flex-col md:flex-row gap-6 bg-zinc-900 rounded-xl overflow-hidden max-w-2xl border border-zinc-800">
          {movie.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full md:w-44 h-64 md:h-auto object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-full md:w-44 h-64 md:h-auto bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <span className="text-zinc-600 text-xs">Afiş yok</span>
            </div>
          )}

          <div className="p-5 flex flex-col justify-center gap-2">
            <h3 className="text-white text-xl font-black leading-tight">{movie.title}</h3>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-yellow-400 font-bold">★ {movie.rating}</span>
              <span className="text-zinc-500">{movie.year}</span>
              <span className="text-zinc-500">{movie.runtime}</span>
            </div>
            <p className="text-zinc-400 text-xs">{movie.genre}</p>
            <p className="text-zinc-300 text-sm leading-relaxed mt-1">{movie.plot}</p>
            <p className="text-zinc-500 text-xs mt-2">
              <span className="text-zinc-400">Yönetmen:</span> {movie.director}
            </p>
            <p className="text-zinc-500 text-xs">
              <span className="text-zinc-400">Oyuncular:</span> {movie.actors}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
