export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
      <a href="/" className="flex items-center">
        <span className="font-black text-2xl tracking-tight">
          <span className="text-[#e50914]">KOU</span>
          <span className="text-white/20 mx-1">|</span>
          <span className="text-white font-extralight tracking-[0.2em]">SINE</span>
        </span>
      </a>
      <a
        href="/admin"
        className="text-sm text-zinc-400 hover:text-white transition-colors border border-zinc-700 hover:border-white px-4 py-1.5 rounded"
      >
        Admin
      </a>
    </nav>
  );
}
