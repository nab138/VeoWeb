"use client";

import { UserListItem } from "@/utils/types";
import styles from "./list.module.css";
import { colorRange } from "@heyeso/color-range";
import React, { useEffect } from "react";
import { FaChevronLeft, FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AutosizeInput from "react-input-autosize";
import ListItem from "./listitem";

export type ListItem = UserListItem & {
  onClick?: () => void;
  editable?: boolean;
  onDelete?: () => void;
};

const colors = ["#0072ce", "#00b6a0"];
export default function List({
  title,
  editable,
  canGoBack,
  canComplete = false,
  items,
  onRename,
  onCreate,
  onDelete,
  onComplete,
  ...props
}: {
  title: string;
  canGoBack?: boolean;
  items: ListItem[];
  editable?: boolean;
  canComplete?: boolean;
  onRename?: (index: number, newName: string) => void;
  onCreate?: (name: string) => void;
  onDelete?: (index: number) => void;
  onComplete?: (index: number, completed: boolean) => void;
} & React.HTMLAttributes<HTMLUListElement>) {
  const [adding, setAdding] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [adding]);

  const router = useRouter();

  let map = colorRange(colors, [
    0,
    items.filter((e) => !e.done).length + (adding ? 1 : 0) - 1,
  ]);
  return (
    <div className={styles.container} style={{ position: "relative" }}>
      <div className={styles.header}>
        {canGoBack && (
          <button
            className={styles.backButton}
            onClick={() => router.push("/dashboard")}
          >
            <FaChevronLeft size={24} />
          </button>
        )}
        <h1>{title}</h1>
      </div>
      <ul {...props} className={styles.list}>
        {adding && (
          <li
            style={{ backgroundColor: map.getColor(0).toHex }}
            className={styles.item}
          >
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onBlur={async () => {
                const name = newListName.trim();
                if (name && onCreate) {
                  await onCreate(name);
                }
                setAdding(false);
                setNewListName("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const name = newListName.trim();
                  if (name && onCreate) {
                    onCreate(name);
                  }
                  setNewListName("");
                } else if (e.key === "Escape") {
                  setAdding(false);
                  setNewListName("");
                }
              }}
              placeholder="New list name"
              style={{ fontWeight: "bold" }}
            />
          </li>
        )}
        {items
          .filter((i) => !i.done)
          .map((item, index) => (
            <ListItem
              key={index + item.text}
              item={item}
              index={items.indexOf(item)}
              visualIndex={index}
              editable={editable}
              onRename={onRename}
              canComplete={canComplete}
              onComplete={onComplete}
              onDelete={() => {
                if (onDelete) {
                  onDelete(index);
                }
              }}
              onEnter={() => {
                if (!adding) {
                  setAdding(true);
                  setNewListName("");
                }
              }}
              adding={adding}
              map={map}
            />
          ))}
        {items
          .filter((i) => i.done)
          .map((item, index) => (
            <ListItem
              key={index + item.text + "done"}
              item={item}
              index={items.indexOf(item)}
              editable={editable}
              onRename={onRename}
              canComplete={canComplete}
              onComplete={onComplete}
              onDelete={() => {
                if (onDelete) {
                  onDelete(index);
                }
              }}
              onEnter={() => {
                if (!adding) {
                  setAdding(true);
                  setNewListName("");
                }
              }}
              adding={adding}
              map={map}
            />
          ))}
      </ul>

      {onCreate && (
        <button
          aria-label="Add List"
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#0072ce",
            color: "white",
            fontSize: 32,
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            cursor: "pointer",
            zIndex: 10,
          }}
          onClick={() => {
            if (!adding) {
              setAdding(true);
              setNewListName("");
            }
          }}
        >
          +
        </button>
      )}
    </div>
  );
}
