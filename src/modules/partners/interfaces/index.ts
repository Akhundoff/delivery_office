export type IPartner = {
  id: number;
  name: string;
  ip: string;
  state: { id: number; name: string };
  description: string;
  createdAt: string;
};

export type IPartnerPersistence = {
  id: number;
  name: string;
  ip: string;
  state_id: number;
  descr: string;
  created_at: string;
  state_name: string;
};
