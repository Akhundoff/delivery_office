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

export type IRefundFormValues = {
  userId: string;
  trackCode: string;
  cargoId: string;
  direction: string;
  refundNumber: string;
  productTypeName: string;
  shopName: string;
  quantity: string;
  price: string;
  description: string;
  file: File | null;
};
