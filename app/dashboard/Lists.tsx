"use client";

import List, { ListItem } from "@/ui/lists/list";
import { UserList } from "@/utils/types";
import { useRouter } from "next/navigation";

export default function Lists({ lists }: { lists: UserList[] }) {
  const router = useRouter();
  return (
    <List
      editable
      title="My Lists"
      items={lists
        .map(
          (item) =>
            ({
              text: item.name,
            } as ListItem)
        )
        .concat([
          {
            text: "Account Settings",
            onClick: () => {
              router.push("/dashboard/account");
            },
            editable: false,
          },
        ])}
    />
  );
}
