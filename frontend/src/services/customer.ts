import { api } from "./api";

export interface CustomerProfile {
  fullName: string;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
}

export interface UpdateProfilePayload {
  fullName: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export async function getProfile(): Promise<CustomerProfile> {
  const res = await api.get<CustomerProfile>("/api/customers/me");
  return res.data;
}

export async function updateProfile(data: UpdateProfilePayload): Promise<CustomerProfile> {
  const res = await api.put<CustomerProfile>("/api/customers/me", data);
  return res.data;
}
