import { api } from "@/lib/client";
import { LoginPayload, AuthAccessPayload, RegisterPayload } from "../types/types";


export async function login(payload: LoginPayload) {
  return api.post("auth/login", { json: payload }).json<AuthAccessPayload>();
}

export async function register(payload: RegisterPayload) {
  await api.post("auth/register", { json: payload });
}

export async function refresh() {
  return api.post("auth/refresh").json<AuthAccessPayload>();
}

export async function logout() {
  await api.post("auth/logout");
}
