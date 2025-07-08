"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  await console.log(error);

  /*
  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
  */
}

export async function signup(
  email: string,
  username: string,
  password: string
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: signUpError,
  } = await supabase.auth.signUp({ email, password });
  if (signUpError || !user) {
    console.error("Sign‑up error:", signUpError);
    throw signUpError;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: user.id, username, email });
  if (profileError) {
    console.error("Profile insert error:", profileError);
    throw profileError;
  }

  return user;
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  return error || true;
}
