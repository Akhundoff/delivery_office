export type IShopName = {
  id: number;
  name: string;
  countryId: number | null;
  countryName: string | null;
  createdAt: string;
};

export type IShopNameFormValues = {
  name: string;
  countryId: string;
};
