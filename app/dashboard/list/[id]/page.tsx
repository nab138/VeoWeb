import { createClient } from "@/utils/supabase/server";
import { UserList } from "@/utils/types";
import { redirect } from "next/navigation";
import ListClient from "./listclient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/");
  }

  const { data: listData, error: listError } = await supabase
    .from("lists")
    .select("*")
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (listError) {
    return (
      <div>
        <h2>Failed to fetch :(</h2>
        <p>{listError.message}</p>
      </div>
    );
  }
  const list = listData[0] as UserList | undefined;
  if (!list) {
    return (
      <div>
        <h2>List not found :(</h2>
        <p>
          It seems like this list does not exist or you do not have access to
          it.
        </p>
      </div>
    );
  }

  return <ListClient list={list} />;
}
