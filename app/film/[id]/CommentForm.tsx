"use client";

import { useRef } from "react";
import { addCommentAction } from "./actions";

export default function CommentForm({ eventId }: { eventId: number }) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await addCommentAction(formData);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <input type="hidden" name="event_id" value={eventId} />
      <input
        name="username"
        required
        maxLength={30}
        placeholder="Adın"
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#e50914] transition-colors text-sm"
      />
      <textarea
        name="content"
        required
        maxLength={500}
        rows={3}
        placeholder="Yorumun..."
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#e50914] transition-colors text-sm resize-none"
      />
      <button
        type="submit"
        className="self-end bg-[#e50914] hover:bg-[#c40812] text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors"
      >
        Yorum Yap
      </button>
    </form>
  );
}
