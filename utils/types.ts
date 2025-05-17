export type UserList = {
  id: string;
  user_id: string;
  name: string;
  items: UserListItem[];
  created_at: string;
};

export type UserListItem = {
  text: string;
  done?: boolean;
};
