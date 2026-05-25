export enum CouponType {
  BALANCE = 1,
  ORDER_SERVICE_PERCENT = 2,
  DELIVERY_DISCOUNT = 3,
  COURIER_DISCOUNT = 4,
}

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

export type ICouponFormValues = {
  name: string;
  tag: string;
  couponType: string;
  amount: string;
  currency: string;
  count: string;
  stateId: string;
  description: string;
};
