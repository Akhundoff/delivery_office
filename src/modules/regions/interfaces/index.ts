export type IRegion = {
  id: number;
  name: string;
  price: number;
  courierPrice: string;
  state: { id: number; name: string } | null;
  branches: { id: number; name: string }[];
  shipping: number;
  description: string;
  createdAt: string;
};

export type IRegionFormValues = {
  name: string;
  price: string;
  courierPrice: string;
  branchIds: string[];
  shipping: string;
  description: string;
};
