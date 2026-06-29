import { api } from "./api";

export interface AdminService {
  id: number;
  name: string;
  category: string;
  price: number;
  durationMin: number;
  active: boolean;
}

export interface ServicePayload {
  name: string;
  category: string;
  price: number;
  durationMin: number;
  active: boolean;
}

export async function getAdminServices(): Promise<AdminService[]> {
  const res = await api.get<AdminService[]>("/api/admin/services");
  return res.data;
}

export async function createService(data: ServicePayload): Promise<AdminService> {
  const res = await api.post<AdminService>("/api/admin/services", data);
  return res.data;
}

export async function updateService(id: number, data: ServicePayload): Promise<AdminService> {
  const res = await api.put<AdminService>(`/api/admin/services/${id}`, data);
  return res.data;
}

export async function deleteService(id: number): Promise<void> {
  await api.delete(`/api/admin/services/${id}`);
}
