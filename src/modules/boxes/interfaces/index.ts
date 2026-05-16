export type IBox = {
  id: number;
  name: string;
  branch: { id: number; name: string } | null;
  user: { id: number; name: string } | null;
  declarationCount: number;
  createdAt: string;
};

export type IBoxFormValues = {
  name: string;
  branchId: string;
};
