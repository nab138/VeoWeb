"use client";

import { UserListItem } from "@/utils/types";
import styles from "./list.module.css";
import { colorRange } from "@heyeso/color-range";

export type ListItem = UserListItem & {
  onClick?: () => void;
  editable?: boolean;
};

const colors = ["#0072ce", "#00b6a0"];
export default function List({
  title,
  editable,
  items,
  ...props
}: {
  title: string;
  items: ListItem[];
  editable?: boolean;
} & React.HTMLAttributes<HTMLUListElement>) {
  let map = colorRange(colors, [0, items.length - 1]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{title}</h1>
      </div>
      <ul {...props} className={styles.list}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              backgroundColor: map.getColor(index).toHex,
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
              onClick={(e) => {
                if (!editable || item.editable === false) {
                  e.preventDefault();
                  e.stopPropagation();
                  item.onClick?.();
                }
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
