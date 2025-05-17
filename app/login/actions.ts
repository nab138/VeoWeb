"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(data: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return error instead of redirecting
    return { error: error.message };
  }

  return { success: true };
}

export async function signup(data: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    // Return error instead of redirecting
    return { error: error.message };
  }

  return { success: true };
}
