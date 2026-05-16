export type IBanner = {
  id: number;
  name: string;
  type: number;
  documentFile: string;
  active: boolean;
  createdAt: string;
};

export type IBannerFormValues = {
  name: string;
  type: string;
  active: boolean;
  documentFile: File | null;
};

export type IBannerType = {
  type: number;
  title: string;
  info: string;
};
