import { apiRequest } from "@/services/http";

export type AuthUser = {
  id: number;
  email: string;
  created_at: string;
};

type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
};

export async function registerUser(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/v1/auth/me", {
    method: "GET",
    token,
  });
}
