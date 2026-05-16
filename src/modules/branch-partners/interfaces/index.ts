export type IBranchPartner = {
  id: number;
  name: string;
  isOwner: boolean;
  description: string;
  contact: string;
  state: { id: number; name: string } | null;
  createdAt: string;
};

export type IBranchPartnerFormValues = {
  name: string;
  isOwner: boolean;
  description: string;
  contact: string;
};
