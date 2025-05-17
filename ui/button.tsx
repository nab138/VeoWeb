import styles from "./button.module.css";

export function Button({
  children,
  variant = "primary",
  size = "medium",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "neutral" | "danger";
  size?: "small" | "medium" | "large";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${styles.button} ${styles[variant ?? "primary"]} ${
        styles[size ?? "medium"]
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
