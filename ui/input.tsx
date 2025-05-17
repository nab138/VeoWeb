import styles from "./input.module.css";

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${styles.input} ${className}`.trim()} {...props} />;
}
