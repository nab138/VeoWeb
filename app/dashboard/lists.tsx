"use client";

import List, { ListItem } from "@/ui/lists/list";
import { UserList } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function Lists({
  lists,
  userId,
}: {
  lists: UserList[];
  userId: string;
}) {
  const router = useRouter();
  const [userLists, setUserLists] = useState(lists);

  const handleRename = async (index: number, newName: string) => {
    if (!newName) return;
    const list = userLists[index];
    const supabase = createClient();
    const { error } = await supabase
      .from("lists")
      .update({ name: newName })
      .eq("id", list.id);
    if (error) {
      toast.error("Failed to rename list: " + error.message);
    } else {
      const updated = [...userLists];
      updated[index] = { ...updated[index], name: newName };
      setUserLists(updated);
    }
  };

  const handleCreate = async (name: string) => {
    if (!name) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("lists")
      .insert([{ name, user_id: userId, items: [] }])
      .select()
      .single();
    if (error) {
      toast.error("Failed to create list: " + error.message);
    } else if (data) {
      setUserLists((prev) => [data, ...prev]);
    }
  };

  const handleDelete = async (index: number) => {
    const list = userLists[index];
    if (!list) return;
    if (!confirm("Are you sure you want to delete this list?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("lists").delete().eq("id", list.id);
    if (error) {
      toast.error("Failed to delete list: " + error.message);
    } else {
      setUserLists((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <List
      editable
      title="My Lists"
      items={userLists
        .map(
          (item) =>
            ({
              text: item.name,
              onClick: () => {
                router.push(`/dashboard/list/${item.id}`);
              },
            } as ListItem)
        )
        .concat([
          {
            text: "Account Settings",
            onClick: () => {
              router.push("/dashboard/account");
            },
            editable: false,
            id: "account-settings",
            list_id: "account-settings",
            done: false,
            user_id: userId,
          },
        ])}
      onRename={handleRename}
      onCreate={handleCreate}
      onDelete={handleDelete}
    />
  );
}
