import { colorRange } from "@heyeso/color-range";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import styles from "./item.module.css";
import { useState, useEffect, useRef } from "react";
import type { ListItem } from "./list";

export default function ListItem({
  item,
  index,
  visualIndex = index,
  editable = true,
  canComplete = false,
  onRename,
  onDelete,
  onComplete,
  adding = false,
  map = colorRange(["#0072ce", "#00b6a0"], [0, 1]),
  onEnter,
}: {
  item: ListItem;
  index: number;
  visualIndex?: number;
  editable?: boolean;
  onRename?: (index: number, newName: string) => void;
  onDelete?: (index: number) => void;
  onComplete?: (index: number, complete: boolean) => void;
  canComplete?: boolean;
  adding?: boolean;
  onEnter?: () => void;
  map?: ReturnType<typeof colorRange>;
}) {
  const [text, setText] = useState(item.text);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const mirrorRef = useRef<HTMLSpanElement | null>(null);

  // Helper to auto-grow textarea height and width
  const autoGrow = (el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = "1.5em";
      el.style.height = el.scrollHeight + "px";
      // Horizontal autosize
      if (mirrorRef.current) {
        mirrorRef.current.textContent = el.value || " ";
        const mirrorWidth = mirrorRef.current.offsetWidth;
        el.style.width = Math.max(mirrorWidth + 2, 60) + "px"; // 2px for caret, 60px min
      }
    }
  };

  // Auto-grow on mount and when text changes
  useEffect(() => {
    autoGrow(textareaRef.current);
  }, [index, text]);

  // Also auto-grow on window resize
  useEffect(() => {
    const handler = () => autoGrow(textareaRef.current);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <li
      key={index + item.text}
      style={{
        backgroundColor: map.getColor(visualIndex + (adding ? 1 : 0)).toHex,
      }}
      className={
        styles.item +
        (item.onClick !== undefined ? ` ${styles.clickable}` : "") +
        (item.done ? ` ${styles.done}` : "")
      }
      onClick={item.onClick}
    >
      {/* Hidden mirror span for width autosize */}
      <span
        ref={mirrorRef}
        className={styles.mirror}
        aria-hidden="true"
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre",
          fontSize: "1.2em",
          fontWeight: 600,
          fontFamily: "inherit",
          padding: 0,
          margin: 0,
          lineHeight: 1.2,
          minWidth: "60px",
          pointerEvents: "none",
        }}
      >
        {text || " "}
      </span>
      <textarea
        ref={textareaRef}
        id={`listitem-textarea-${index}`}
        rows={1}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "var(--foreground)",
          fontSize: "1.2em",
          fontWeight: 600,
          outline: "none",
          resize: "none",
          minHeight: "1.5em",
          lineHeight: 1.2,
          fontFamily: "inherit", // Fix font to inherit from parent, not monospace
          overflow: "hidden", // Prevent scrollbars
          minWidth: "60px",
          width: "100%", // Will be overridden by autoGrow
          boxSizing: "content-box",
        }}
        className={
          styles.input +
          (item.onClick !== undefined && (!editable || item.editable === false)
            ? ` ${styles.clickable}`
            : "")
        }
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          autoGrow(e.target);
        }}
        readOnly={!editable || item.editable === false}
        onBlur={(e) => {
          autoGrow(e.target);
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
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.stopPropagation();
            e.preventDefault();
            if (typeof onEnter === "function") {
              onEnter();
            }
          }
        }}
      />
      <div className={styles.buttons}>
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
        {canComplete && onComplete && (
          <button
            aria-label="Complete"
            className={styles.button}
            style={{
              color: "var(--foreground)",
            }}
            onClick={() => onComplete(index, !item.done)}
          >
            <FaCheck />
          </button>
        )}
      </div>
    </li>
  );
}
