export type IWaybill = {
  id: number;
  trackCode: string;
  currency: string;
  price: string;
  provider: number | null;
  barcode: string | null;
  countryData: {
    carrierCompanyAddress: string;
    carrierCompanyName: string;
    countryCode: string;
    currencyType: string;
    id: number;
  };
  quantity: number;
  weight: number;
  productPrice: { try: number; usd: number };
  deliveryPrice: number;
  totalPrice: number;
  shop: string;
  productType: { name: string };
  user: { id: number; fullName: string; phoneNumber: string; address: string; passportNumber: string };
  currencyRate: number;
  printedAt: string;
  regNumber: string | null;
};

export type IWaybillPersistence = {
  currency_rate: string;
  declaration_id: number;
  currency: string;
  price: string;
  barcode: string | null;
  provider: number | null;
  country_data: {
    carrier_company_address: string;
    carrier_company_name: string;
    country_code: string;
    currency_type: string;
    id: number;
  };
  delivery_price: string;
  number: string;
  passport_number: string;
  print_date: string;
  product_price_try: string;
  product_price_usd: string;
  product_type_name: string;
  shop_name: string;
  quantity: number;
  total_price: number;
  track_code: string;
  user_address: string;
  user_id: number;
  user_name: string;
  weight: number;
  RegNumber: string | null;
};
