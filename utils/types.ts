export type UserList = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type UserListItem = {
  text: string;
  id: string;
  list_id: string;
  user_id: string;
  done: boolean;
};
