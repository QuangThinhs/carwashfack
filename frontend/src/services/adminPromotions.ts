import { api } from "./api";

export interface PromoTargetCustomer {
  id: number;
  fullName: string;
  phone: string;
}

export interface AdminPromotion {
  id: number;
  code: string;
  name: string;
  description: string | null;
  discountPercent: number;
  targetType: string; // ALL | TIER | USER
  minTier: string | null;
  usageLimit: number | null;
  usageCount: number;
  targetCustomers: PromoTargetCustomer[];
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface PromotionPayload {
  code: string;
  name: string;
  description?: string;
  discountPercent: number;
  targetType: string;
  minTier?: string;
  targetCustomerIds?: number[];
  usageLimit?: number | null;
  startDate: string;
  endDate: string;
  active: boolean;
}

export async function getAdminPromotions(): Promise<AdminPromotion[]> {
  const res = await api.get<AdminPromotion[]>("/api/admin/promotions");
  return res.data;
}

export async function createPromotion(data: PromotionPayload): Promise<AdminPromotion> {
  const res = await api.post<AdminPromotion>("/api/admin/promotions", data);
  return res.data;
}

export async function updatePromotion(id: number, data: PromotionPayload): Promise<AdminPromotion> {
  const res = await api.put<AdminPromotion>(`/api/admin/promotions/${id}`, data);
  return res.data;
}

export async function deletePromotion(id: number): Promise<void> {
  await api.delete(`/api/admin/promotions/${id}`);
}
