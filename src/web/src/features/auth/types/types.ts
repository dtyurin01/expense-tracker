export type AuthAccessPayload = {
  access_token: string;
  expires_in: number;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};
