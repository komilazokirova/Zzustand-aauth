export interface LoginCredentials {
  email: string;
  password: string;
}
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface Profile {
  id: number;
  email: string;
  name: string;
  role: "customer" | "admin";
  avatar: string;
}