export type IShop = {
  id: number;
  label: string;
  logo: string;
  categoryIds: number[];
  categoryName: string;
  countryId: number;
  url: string;
};

export type IShopType = {
  id: number;
  name: string;
};

export type IShopFormValues = {
  label: string;
  url: string;
  countryId: string;
  categoryIds: string[];
  logo: File | null;
};
