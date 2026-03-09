import { loginAction } from "../actions";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-black text-3xl tracking-tight">
            <span className="text-[#e50914]">KOU</span>
            <span className="text-white/20 mx-1">|</span>
            <span className="text-white font-extralight tracking-[0.2em]">SINE</span>
          </p>
          <p className="text-zinc-500 text-sm mt-2">Admin Paneli</p>
        </div>

        <form
          action={loginAction}
          className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 flex flex-col gap-5"
        >
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Şifre</label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              placeholder="Admin şifresi"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e50914] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#e50914] hover:bg-[#c40812] text-white font-bold py-3 rounded-lg transition-colors"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </main>
  );
}
