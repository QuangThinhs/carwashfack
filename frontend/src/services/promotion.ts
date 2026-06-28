import { api } from "./api";

export interface Promotion {
  id: number;
  code: string;
  name: string;
  description: string | null;
  discountPercent: number;
  minTierLabel: string | null;
}

export interface PromoApplyResult {
  valid: boolean;
  code: string | null;
  name: string | null;
  discountPercent: number;
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  message: string;
}

export async function getPromotions(): Promise<Promotion[]> {
  const res = await api.get<Promotion[]>("/api/promotions");
  return res.data;
}

/** Kiểm tra / xem trước giảm giá khi khách nhập mã cho một dịch vụ. */
export async function applyPromo(code: string, serviceIds: number[]): Promise<PromoApplyResult> {
  const res = await api.post<PromoApplyResult>("/api/promotions/apply", { code, serviceIds });
  return res.data;
}
