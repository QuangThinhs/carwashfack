import { api } from "./api";

export interface Vehicle {
  id: number;
  licensePlate: string;
  type: string | null;
  brand: string | null;
}

export interface VehiclePayload {
  licensePlate: string;
  type?: string;
  brand?: string;
}

export async function getVehicles(): Promise<Vehicle[]> {
  const res = await api.get<Vehicle[]>("/api/vehicles");
  return res.data;
}

export async function addVehicle(data: VehiclePayload): Promise<Vehicle> {
  const res = await api.post<Vehicle>("/api/vehicles", data);
  return res.data;
}

export async function updateVehicle(id: number, data: VehiclePayload): Promise<Vehicle> {
  const res = await api.put<Vehicle>(`/api/vehicles/${id}`, data);
  return res.data;
}

export async function deleteVehicle(id: number): Promise<void> {
  await api.delete(`/api/vehicles/${id}`);
}
