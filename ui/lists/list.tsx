"use client";

import { UserListItem } from "@/utils/types";
import styles from "./list.module.css";
import { colorRange } from "@heyeso/color-range";
import React, { useEffect } from "react";
import { FaChevronLeft, FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

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
  items,
  onRename,
  onCreate,
  onDelete,
  ...props
}: {
  title: string;
  canGoBack?: boolean;
  items: ListItem[];
  editable?: boolean;
  onRename?: (index: number, newName: string) => void;
  onCreate?: (name: string) => void;
  onDelete?: (index: number) => void;
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

  let map = colorRange(colors, [0, items.length + (adding ? 1 : 0) - 1]);
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
              placeholder="New list name"
              style={{ fontWeight: "bold" }}
            />
          </li>
        )}
        {items.map((item, index) => (
          <li
            key={index + item.text}
            style={{
              backgroundColor: map.getColor(index + (adding ? 1 : 0)).toHex,
              position: "relative",
              overflow: "hidden",
              height: 56,
              display: "flex",
              alignItems: "center",
            }}
            className={
              styles.item +
              (item.onClick !== undefined ? ` ${styles.clickable}` : "")
            }
            onClick={item.onClick}
          >
            <input
              type="text"
              className={
                styles.input +
                (item.onClick !== undefined &&
                (!editable || item.editable === false)
                  ? ` ${styles.clickable}`
                  : "")
              }
              defaultValue={item.text}
              readOnly={!editable || item.editable === false}
              onBlur={(e) => {
                if (
                  editable &&
                  item.editable !== false &&
                  onRename &&
                  e.target.value !== item.text
                ) {
                  onRename(index, e.target.value);
                }
              }}
              onClick={(e) => {
                if (editable && item.editable !== false) {
                  e.stopPropagation();
                  return;
                }
                if (!editable || item.editable === false) {
                  e.preventDefault();
                  item.onClick?.();
                }
              }}
              style={{ flex: 1 }}
            />
            {onDelete && editable && item.editable !== false && (
              <button
                aria-label="Delete"
                className={styles.button}
                style={{
                  color: "var(--danger)",
                }}
                onClick={() => onDelete(index)}
              >
                <FaRegTrashAlt size={16} />
              </button>
            )}
          </li>
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
