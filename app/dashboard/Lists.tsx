import ListItemCard from "@/ui/ListItemCard";
import { createClient } from "@/utils/supabase/server";
import { toast } from "sonner";

export default async function Lists({ user }: { user: { id: string } }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("user_id", user.id);
  if (error) {
    toast.error("Failed to fetch lists");
    return (
      <div>
        <h2>Failed to fetch :(</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  console.log("Fetched lists:", data);
  return (
    <ul>
      {data.map((list) => (
        <ListItemCard key={list.id}>{list.name}</ListItemCard>
      ))}
      <ListItemCard>+ Create New</ListItemCard>
    </ul>
  );
}
