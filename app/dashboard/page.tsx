import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {} from "./SignOutButton";
import styles from "./dashboard.module.css";
import Lists from "./lists";
import { UserList } from "@/utils/types";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/");
  }

  const { data: listsData, error: listsError } = await supabase
    .from("lists")
    .select("*")
    .eq("user_id", userData.user.id);
  if (listsError) {
    return (
      <div>
        <h2>Failed to fetch :(</h2>
        <p>{listsError.message}</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <Lists
        lists={(listsData as UserList[]).sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        })}
        userId={userData.user.id}
      />
    </main>
  );
}
