export type IProformaInvoice = {
  user: {
    id: number;
    fullName: string;
    country: string;
    city: string;
    address: string;
    phoneNumber: string;
  };
  items: {
    trackCode: number;
    weight: number;
    quantity: number;
    price: number;
    unitPrice: number;
    country: string;
    productType: { name: string };
  }[];
  totalPrice: number;
  totalQuantity: number;
  totalWeight: number;
  createdAt: string;
};

export type IProformaInvoicePersistence = {
  user: {
    id: number;
    user_name: string;
    address: string;
    number: string;
    city: string;
    country: string;
  };
  declarations: {
    product_type_name: string;
    country: string;
    quantity: number;
    price: string;
    unit_price: string;
    track_code: number;
    weight: string;
  }[];
  total_quantity: number;
  weight: number;
  price: number;
  date: string;
};
