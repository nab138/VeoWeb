"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!error && data?.user) {
    redirect("/dashboard");
  }

  return <LoginClient />;
}
