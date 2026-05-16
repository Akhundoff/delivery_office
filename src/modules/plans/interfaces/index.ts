export type IPlan = {
  id: number;
  weight: { from: number; to: number | null };
  price: number;
  oldPrice: number;
  countryId: number;
  type: "maye" | "digər";
  tariffCategory: { id: number; name: string };
  description: string;
  currency: string;
};

export type IPlanFormValues = {
  countryId: string;
  weightFrom: string;
  weightTo: string;
  price: string;
  oldPrice: string;
  description: string;
  isLiquid: boolean;
  categoryId: string;
};
