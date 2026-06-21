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

export type IStatusLog = {
  id: number;
  status: { id: number; name: string };
  user: { id: number; name: string };
  createdAt: string;
};

export type IStatusMap = {
  id: number;
  descr: string;
  createdAt: string;
  state: { id: number; name: string };
  user: { id: number; name: string };
};
