"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function addCommentAction(formData: FormData) {
  const supabase = getSupabase();
  const event_id = formData.get("event_id") as string;
  const username = (formData.get("username") as string).trim();
  const content = (formData.get("content") as string).trim();

  if (!username || !content) return;

  await supabase.from("comments").insert({ event_id, username, content });
  revalidatePath(`/film/${event_id}`);
}
