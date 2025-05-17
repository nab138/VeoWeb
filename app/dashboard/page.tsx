import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SignOutButton } from "./SignOutButton";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="centered-container">
      <main>
        <h1>Dashboard</h1>
        <p>Welcome, {data.user.email}!</p>
        <SignOutButton />
      </main>
    </div>
  );
}
