"use client";

import List from "@/ui/lists/list";
import { UserList, UserListItem } from "@/utils/types";
import styles from "./listclient.module.css";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function ListClient({
  list,
  defaultItems,
}: {
  list: UserList;
  defaultItems: UserListItem[];
}) {
  let [items, setItems] = useState<UserListItem[]>(defaultItems);

  const handleCreate = async (name: string) => {
    if (!name) return;
    const supabase = createClient();
    let item: UserListItem = {
      text: name,
      id: crypto.randomUUID(),
      user_id: list.user_id,
      list_id: list.id,
      done: false,
      index: 0,
    };
    const { error: indexError } = await supabase.rpc("increment_item_indices", {
      list_id_param: list.id,
    });
    if (indexError) {
      return toast.error("Failed to update item index: " + indexError.message);
    }
    const { data, error } = await supabase
      .from("items")
      .insert([item])
      .select()
      .single();

    if (error) {
      toast.error("Failed to create item: " + error.message);
    } else if (data) {
      setItems((prev) => [data, ...prev]);
    }
  };

  const handleDelete = useCallback(
    async (index: number) => {
      if (!items[index]) return;

      const supabase = createClient();
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", items[index].id)
        .eq("list_id", list.id);

      if (!error) {
        const { error: indexError } = await supabase.rpc(
          "decrement_item_indices",
          {
            list_id_param: list.id,
            index_param: items[index].index,
          }
        );
        if (indexError) {
          toast.error("Failed to update item index: " + indexError.message);
        }
      }
      if (error) {
        toast.error("Failed to delete item: " + error.message);
      } else {
        setItems((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [items]
  );

  const handleRename = useCallback(
    async (index: number, newName: string) => {
      if (!newName || !items[index]) return;

      const supabase = createClient();
      const { error } = await supabase
        .from("items")
        .update({ text: newName })
        .eq("id", items[index].id)
        .eq("list_id", list.id);
      if (error) {
        toast.error("Failed to rename item: " + error.message);
      } else {
        setItems((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], text: newName };
          return updated;
        });
      }
    },
    [items]
  );

  const handleComplete = useCallback(
    async (index: number, done: boolean) => {
      if (!items[index]) return;

      const supabase = createClient();
      const { error } = await supabase
        .from("items")
        .update({ done })
        .eq("id", items[index].id)
        .eq("list_id", list.id);
      if (error) {
        toast.error("Failed to update item: " + error.message);
      } else {
        setItems((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], done };
          return updated;
        });
      }
    },
    [items]
  );
  return (
    <main className={styles.main}>
      <List
        canComplete
        canGoBack
        editable
        title={list.name}
        items={items}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onRename={handleRename}
        onComplete={handleComplete}
      />
    </main>
  );
}
