export type ICoupon = {
  id: number;
  name: string;
  tag: string;
  couponType: number;
  amount: number;
  currency: string;
  count: number;
  description: string;
  createdAt: string;
  state: { id: number; name: string } | null;
  country: { id: number; name: string } | null;
  region: { id: number; name: string } | null;
};
