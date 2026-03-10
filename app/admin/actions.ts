"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 saat
      path: "/",
    });
    redirect("/admin");
  } else {
    redirect("/admin/login?error=1");
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function addEventAction(formData: FormData) {
  const supabase = getSupabase();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const event_date = formData.get("event_date") as string;
  const location = formData.get("location") as string;
  const trailer_url = formData.get("trailer_url") as string;
  const map_url = formData.get("map_url") as string;
  const is_active = formData.get("is_active") === "on";
  const posterFile = formData.get("poster") as File;

  let poster_url = "";

  // Poster yükle
  if (posterFile && posterFile.size > 0) {
    const ext = posterFile.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const buffer = await posterFile.arrayBuffer();

    const { data, error } = await supabase.storage
      .from("posters")
      .upload(fileName, buffer, { contentType: posterFile.type });

    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from("posters")
        .getPublicUrl(fileName);
      poster_url = urlData.publicUrl;
    }
  }

  await supabase.from("events").insert({
    title,
    description,
    event_date,
    location,
    poster_url,
    trailer_url,
    map_url,
    is_active,
  });

  redirect("/admin");
}

export async function updateEventAction(formData: FormData) {
  const supabase = getSupabase();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const event_date = formData.get("event_date") as string;
  const location = formData.get("location") as string;
  const trailer_url = formData.get("trailer_url") as string;
  const map_url = formData.get("map_url") as string;
  const is_active = formData.get("is_active") === "on";
  const posterFile = formData.get("poster") as File;

  let poster_url: string | undefined;

  if (posterFile && posterFile.size > 0) {
    const ext = posterFile.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const buffer = await posterFile.arrayBuffer();
    const { data, error } = await supabase.storage
      .from("posters")
      .upload(fileName, buffer, { contentType: posterFile.type });
    if (!error && data) {
      const { data: urlData } = supabase.storage.from("posters").getPublicUrl(fileName);
      poster_url = urlData.publicUrl;
    }
  }

  await supabase.from("events").update({
    title,
    description,
    event_date,
    location,
    trailer_url,
    map_url,
    is_active,
    ...(poster_url ? { poster_url } : {}),
  }).eq("id", id);

  redirect("/admin");
}

export async function deleteEventAction(formData: FormData) {
  const supabase = getSupabase();
  const id = formData.get("id") as string;
  await supabase.from("events").delete().eq("id", id);
  redirect("/admin");
}

export async function deleteCommentAction(formData: FormData) {
  const supabase = getSupabase();
  const id = formData.get("id") as string;
  const eventId = formData.get("event_id") as string;
  await supabase.from("comments").delete().eq("id", id);
  redirect(`/film/${eventId}`);
}

export async function toggleActiveAction(formData: FormData) {
  const supabase = getSupabase();
  const id = formData.get("id") as string;
  const current = formData.get("is_active") === "true";
  await supabase.from("events").update({ is_active: !current }).eq("id", id);
  redirect("/admin");
}
