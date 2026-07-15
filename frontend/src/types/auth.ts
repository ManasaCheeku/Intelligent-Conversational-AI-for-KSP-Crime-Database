export type UserRole = "citizen" | "police_officer" | "admin";

export interface User {
  id: number;
  full_name: string;
  email: string;
  mobile: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationPayload extends LoginCredentials {
  full_name: string;
  mobile: string;
  confirm_password: string;
  role: UserRole;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  user: User;
}
