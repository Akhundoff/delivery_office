export type IProductType = {
  id: number;
  name: string;
  nameAz: string;
  nameEn: string;
  nameRu: string;
  nameTr: string;
  status: { id: number; name: string } | null;
};

export type IProductTypeFormValues = {
  name: string;
  nameEn: string;
  nameRu: string;
  nameTr: string;
  statusId: string;
};
