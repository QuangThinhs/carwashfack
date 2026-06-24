import { api } from "./api";

export interface CustomerProfile {
  fullName: string;
  phone: string;
  email: string | null;
}

export async function getProfile(): Promise<CustomerProfile> {
  const res = await api.get<CustomerProfile>("/api/customers/me");
  return res.data;
}

export async function updateProfile(data: {
  fullName: string;
  email?: string;
}): Promise<CustomerProfile> {
  const res = await api.put<CustomerProfile>("/api/customers/me", data);
  return res.data;
}
