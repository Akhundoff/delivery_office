export enum CouponType {
  BALANCE = 1,
  ORDER_SERVICE_PERCENT = 2,
  DELIVERY_DISCOUNT = 3,
  COURIER_DISCOUNT = 4,
}

export enum UserGender {
  BOTH = 1,
  MALE = 2,
  FEMALE = 3,
}

export enum PlatformType {
  EVERYWHERE = 'everywhere',
  WEB = 'web',
  MOBILE = 'mobile',
}

export const CouponTypeLabels: Record<number, string> = {
  [CouponType.BALANCE]: 'Balans artımı',
  [CouponType.ORDER_SERVICE_PERCENT]: 'Sifariş xidmətinə faiz',
  [CouponType.DELIVERY_DISCOUNT]: 'Çatdırılmaya endirim',
  [CouponType.COURIER_DISCOUNT]: 'Kuryerə endirim',
};

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
  platform: string;
  period: { from: string; to: string };
  userRegister: { from: string; to: string; gender: number };
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
  platform: string;
  periodFrom: any | null;
  periodTo: any | null;
  userRegisterFrom: any | null;
  userRegisterTo: any | null;
  userGender: string;
  singleUse: boolean;
  countryId: string;
  branchId: string;
  regionId: string;
  userIds: string[];
};
