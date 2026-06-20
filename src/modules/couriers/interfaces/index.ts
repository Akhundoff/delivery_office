export type ICourier = {
  id: number;
  user: { id: number; name: string };
  branch: { id: number; name: string };
  status: { id: number; name: string };
  region: { id: number | null; name: string };
  recipient: string;
  address: string;
  phoneNumber: string;
  price: number;
  totalPrice: number;
  paid: boolean;
  declarations: number[];
  read: boolean;
  description: string;
  isAzerpost: boolean;
  createdAt: string;
  courierPrice: number;
};

export type IDetailedCourierDeclaration = {
  id: number;
  trackCode: number;
  globalTrackCode: string;
  weight: number;
  quantity: number;
  productPrice: number;
  deliveryPrice: number;
  penaltyPrice: number;
  paid: boolean;
  shop: string;
  createdAt: string;
};

export type IDetailedCourier = {
  id: number;
  documentNumber: string;
  postBranch: string;
  user: { id: number; name: string };
  branch: { id: number; name: string };
  status: { id: number; name: string };
  region: { id: number | null; name: string };
  recipient: string;
  address: string;
  phoneNumber: string;
  price: number;
  totalPrice: number;
  courierPrice: number;
  paid: boolean;
  declarations: { quantity: number; weight: number; items: IDetailedCourierDeclaration[] };
  read: boolean;
  description: string;
  isAzerpost: boolean;
  createdAt: string;
  azerpost?: {
    orderId: string;
    vendorId: string;
    packageId: string;
    deliveryPostCode: string;
    packageWeight: string;
    customerAddress: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    deliveryType: string;
    charge: string;
    orderStatus: string;
    createdAt: string;
    history: { createdAt: string; details: string }[];
  };
};

export type IAzerpostBranch = {
  id: number;
  name: string;
  branch_index: string;
  region_id: number;
};

export type ICourierCost = {
  region_price: string;
  total_declaration_count: number;
  total_price: number;
  total_weight: number;
};

export type IDelivererAssignment = {
  id: number;
  client: { id: number; name: string };
  status: { id: number; name: string };
  region: { id: number; name: string };
  deliverer: { id: number; name: string };
  assignedAt: string;
  createdAt: string;
};

export type CreateCourierDto = {
  id?: string;
  userId: string;
  regionId: string | null;
  recipient: string;
  phoneNumber: string;
  declarationIds: string[];
  price: string;
  courierPrice: string;
  address: string;
  paid: boolean;
  description: string;
  postBranch?: string;
  documentNumber?: string;
};

export type ICourierPaymentDetails = {
  balance: { usd: number; try: number; usdToAzn: number; tryToAzn: number };
  debts: { usd: number; try: number; usdToAzn: number; tryToAzn: number };
  courierPrice: { azn: number };
  deliveryPrice: { azn: number; usd: number };
  minimalPayment: { azn: number };
  fullPayment: { azn: number };
};

export type IDelivererReason = { id: number; name: string };

export type ICourierStatusExecution = { id: number; name: string; date: string | null; executor: string | null };
