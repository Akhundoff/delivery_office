export type IStatus = {
  id: number;
  name: string;
  nameEn: string;
  parentId: number | null;
  model: { id: number; name: string } | null;
  createdAt: string;
  description: string;
  freely: boolean;
};

export type IStatusFormValues = {
    name: string;
    nameEn: string;
    modelId: string;
    parentId: string;
    description: string;
};
