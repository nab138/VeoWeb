import { colorRange } from "@heyeso/color-range";
import { FaRegTrashAlt } from "react-icons/fa";
import styles from "./list.module.css";
import { useState } from "react";
import AutosizeInput from "react-input-autosize";

export default function ListItem({
  item,
  index,
  editable = true,
  onRename,
  onDelete,
  adding = false,
  map = colorRange(["#0072ce", "#00b6a0"], [0, 1]),
}: {
  item: {
    text: string;
    onClick?: () => void;
    editable?: boolean;
  };
  index: number;
  editable?: boolean;
  onRename?: (index: number, newName: string) => void;
  onDelete?: (index: number) => void;
  adding?: boolean;
  map?: ReturnType<typeof colorRange>;
}) {
  const [text, setText] = useState(item.text);
  return (
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
        styles.item + (item.onClick !== undefined ? ` ${styles.clickable}` : "")
      }
      onClick={item.onClick}
    >
      <AutosizeInput
        type="text"
        inputStyle={{
          backgroundColor: "transparent",
          border: "none",
          color: "var(--foreground)",
          fontSize: "1.2em",
          fontWeight: 700,
          outline: "none",
        }}
        className={
          styles.input +
          (item.onClick !== undefined && (!editable || item.editable === false)
            ? ` ${styles.clickable}`
            : "")
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
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
  );
}
