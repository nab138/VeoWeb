import styles from "./card.module.css";

export function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.card} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
