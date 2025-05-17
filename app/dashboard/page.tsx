import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SignOutButton } from "./SignOutButton";
import styles from "./dashboard.module.css";
import { Card } from "@/ui/card";
import Lists from "./Lists";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <main className={styles.main}>
      <Card>
        <h1>My Lists</h1>
        <Lists user={data.user} />
      </Card>
      <Card className={styles.accountCard}>
        <h2>Account</h2>
        <p>Email: {data.user.email}</p>
        <p>UID: {data.user.id}</p>
        <p>Created at: {new Date(data.user.created_at).toLocaleString()}</p>
        <SignOutButton />
      </Card>
    </main>
  );
}
