"use client";
import { Button } from "@/ui/button";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export function SignOutButton() {
  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
    } else {
      redirect("/login");
    }
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
