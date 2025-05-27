"use client";

import List from "@/ui/lists/list";
import { UserList, UserListItem } from "@/utils/types";
import styles from "./listclient.module.css";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function ListClient({ list }: { list: UserList }) {
  let [items, setItems] = useState<UserListItem[]>(list.items || []);

  const handleCreate = useCallback(
    async (name: string) => {
      if (!name) return;
      const supabase = createClient();
      let newItem = {
        text: name,
        done: false,
        id: crypto.randomUUID(),
      } as UserListItem;
      const { error } = await supabase
        .from("lists")
        .update([{ items: [newItem].concat(items) }])
        .eq("id", list.id);
      if (error) {
        toast.error("Failed to create list: " + error.message);
      } else {
        setItems((prev) => [newItem, ...prev]);
      }
    },
    [items]
  );

  const handleDelete = useCallback(
    async (index: number) => {
      if (!items[index]) return;

      const supabase = createClient();
      const { error } = await supabase
        .from("lists")
        .update([{ items: items.filter((_, i) => i !== index) }])
        .eq("id", list.id);
      if (error) {
        toast.error("Failed to create list: " + error.message);
      } else {
        setItems((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [items]
  );

  const handleRename = useCallback(
    async (index: number, newName: string) => {
      if (!items[index]) return;

      const supabase = createClient();
      const updatedItems = [...items];
      updatedItems[index] = { ...updatedItems[index], text: newName };
      const { error } = await supabase
        .from("lists")
        .update([{ items: updatedItems }])
        .eq("id", list.id);
      if (error) {
        toast.error("Failed to rename item: " + error.message);
      } else {
        setItems(updatedItems);
      }
    },
    [items]
  );

  const handleComplete = useCallback(
    async (index: number, done: boolean) => {
      if (!items[index]) return;

      const supabase = createClient();
      const updatedItems = [...items];
      updatedItems[index] = { ...updatedItems[index], done };
      const { error } = await supabase
        .from("lists")
        .update([{ items: updatedItems }])
        .eq("id", list.id);
      if (error) {
        toast.error("Failed to update item: " + error.message);
      } else {
        setItems(updatedItems);
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
