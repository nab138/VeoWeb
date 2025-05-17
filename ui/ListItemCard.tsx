export default function ListItemCard({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLLIElement>) {
  return <li {...props}>{children}</li>;
}
