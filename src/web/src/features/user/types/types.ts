export type UserProfile = {
  id: string;
  email: string;
  userName: string;
  avatarUrl: string | null;
  currency: string;
  roles: string[];
};

export type UpdateAvatarResponse = {
  avatarUrl: string;
};
