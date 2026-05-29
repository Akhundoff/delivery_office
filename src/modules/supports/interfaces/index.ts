export type ISupport = {
  id: number;
  category: { id: number; name: string };
  client: { id: number; name: string };
  executor: { id: number; name: string } | null;
  counts: { new: number; all: number };
  status: { id: number; name: string };
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ISupportMessage = {
  id: number;
  message: string;
  documents: { name: string; extension: string; url: string }[];
  sender: { name: string; role: 'client' | 'admin' | 'warehouseman' };
  createdAt: string;
};

export type ISupportDetails = {
  id: number;
  category: { id: number; name: string };
  status: { id: number; name: string };
  client: { id: number; name: string };
  read: boolean;
  messages: ISupportMessage[];
  createdAt: string;
};

export type ISupportCategory = {
  id: number;
  name: string;
  hidden: boolean;
};

export type ISupportMessageTemplate = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
};

export type ISupportSelectUser = {
  id: number;
  firstname: string;
  lastname: string;
};

export type ICreateSupportFormValues = {
  userId: string;
  categoryId: string;
  body: string;
  files: File[];
};

export type ICreateSupportCategoryFormValues = {
  id?: string;
  name: string;
  hidden: boolean;
};
