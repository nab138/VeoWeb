import { Card } from "@/ui/card";
import { SignOutButton } from "../SignOutButton";
import styles from "./account.module.css";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/ui/button";

export default async function Account() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <main className={styles.main}>
      <Card className={styles.accountCard + " " + styles.card}>
        <h2>Account</h2>
        <p>Email: {data.user.email}</p>
        <p>UID: {data.user.id}</p>
        <p>Created at: {new Date(data.user.created_at).toLocaleString()}</p>
        <div className={styles.actions}>
          <SignOutButton />
          <Link href="/dashboard" className={styles.link} passHref>
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
