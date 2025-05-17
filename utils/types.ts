export type UserList = {
  id: string;
  user_id: string;
  name: string;
  items: UserListItem[];
};

export type UserListItem = {
  text: string;
  done?: boolean;
};
