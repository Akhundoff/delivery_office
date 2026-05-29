export interface IPartnerBox {
  id: number;
  name: string;
  user: { id: number; name: string } | null;
  branch: { id: number; name: string } | null;
  declarationCount: number;
  createdAt: string;
}

export interface IPartnerBoxFormValues {
  name: string;
}
