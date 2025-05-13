type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

type UserProfile = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
};

export type { Post, UserProfile };
