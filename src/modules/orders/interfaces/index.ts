export type IOrder = {
  id: number;
  trackCode: string;
  user: { id: number; name: string };
  status: { id: number; name: string };
  paid: boolean;
  returned: boolean;
  couponId: number;
  product: {
    url: string;
    size: string;
    color: string;
    price: number;
    internalShippingPrice: number;
    shop: string;
    quantity: number;
    type: { id: number; name: string } | null;
  };
  executor: { id: number; name: string } | null;
  declaration: { id: number; trackCode: string } | null;
  debts: { productPrice: number; internalShippingPrice: number };
  read: boolean;
  isUrgent: boolean;
  rejectionReason: string;
  countryId: number;
  description: string;
  expectedAt: string | null;
  updatedAt: string | null;
  createdAt: string;
};

export type IDetailedOrder = IOrder & {
  detailedDebts: {
    id: string;
    param: string;
    amount: { current: number; difference: number };
    status: { id: number; name: string };
    description: string;
    createdAt: string;
  }[];
};

export type IOrderStateExecution = {
  id: number;
  ref: { id: number; name: string };
  executor: { id: number; name: string } | null;
  isCurrent: boolean;
  createdAt: string | null;
};

export type ICreateOrderValues = {
  id?: string;
  userId: string;
  countryId: string;
  isUrgent: boolean;
  description: string;
  product: {
    url: string;
    shop: string;
    typeId: string;
    color: string;
    size: string;
    quantity: string;
    price: string;
    internalShippingPrice: string;
  };
};

export type IRejectOrdersValues = {
  description: string;
};
