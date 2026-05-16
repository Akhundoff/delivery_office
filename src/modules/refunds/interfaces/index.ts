export type IRefund = {
  id: number;
  shopName: string;
  trackCode: string;
  refundNumber: number | null;
  cargo: { id: number; name: string } | null;
  user: { id: number; name: string } | null;
  state: { id: number; name: string } | null;
  productType: { name: string } | null;
  price: number | null;
  quantity: number | null;
  description: string;
  direction: string;
  file: string | null;
  createdAt: string;
};
