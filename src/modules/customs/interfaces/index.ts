export * from './customs-task.interface';

export type IDnsQueue = {
  id: number;
  action: string;
  query: any[];
  statusCode: string | null;
  response: object | null;
  attempts: number;
  createdAt: string;
  updatedAt: string | null;
  retriedAt: string | null;
};

export type ICustomsDeclarationPersistence = {
  id: number;
  GoodsName: string;
  ImportName: string;
  InvoicePriceFull: string;
  InvoicePriceUsd: string;
  PayStatus: string;
  PinNumber: string;
  QuantityFull: string;
  RegNumber: string;
  TrackingNumber: string;
  created_at: string;
  flight_id: number | null;
  user_id: number | null;
  user_name: string | null;
};

export type ICustomsDeclaration = {
  id: number;
  user: { id: number; name: string } | null;
  importer: { name: string; passportSecret: string };
  productType: string;
  invoicePrice: { original: string; usd: string };
  quantity: number;
  paymentStatus: string;
  regNumber: string;
  trackingNumber: string;
  flight: { id: number } | null;
  createdAt: string;
};

export type ICustomsPostPersistence = {
  id: number;
  direction: number;
  trackinG_NO: string;
  transP_COSTS: number;
  weighT_GOODS: number;
  quantitY_OF_GOODS: number;
  invoyS_PRICE: number;
  currencY_TYPE: string;
  invoyS_AZN: number;
  invoyS_USD: number;
  documenT_TYPE: string;
  fin: string;
  voen: string;
  idxaL_NAME: string;
  idxaL_ADRESS: string;
  phone: string;
  ixraC_NAME: string;
  ixraC_ADRESS: string;
  goodS_TRAFFIC_FR: string;
  goodS_TRAFFIC_TO: string;
  inserT_DATE: string;
  airwaybill: string | null;
  depesH_NUMBER: string | null;
  depesH_DATE: string | null;
  status: string;
  ecoM_REGNUMBER: string;
  packagE_TYPE: string;
  goodsList: { goodS_ID: number; namE_OF_GOODS: string }[];
};

export type ICustomsPost = {
  id: number;
  direction: number;
  trackingNumber: string;
  transportationCost: number;
  weight: number;
  quantity: number;
  importer: { name: string; address: string; fin: string; voen: string | null };
  exporter: { name: string; address: string };
  invoice: { price: number; currency: string; azn: number; usd: number };
  goods: { id: number; name: string }[];
  documentType: string;
  airWaybill: string | null;
  dispatchNumber: string | null;
  status: string;
  eComRegNumber: string;
  packageType: string;
  dispatchedAt: string | null;
  createdAt: string;
};
