export type IPartnerDeclaration = {
  id: number;
  user: { id: number; name: string };
  partner: { id: number; name: string };
  trackCode: string;
  globalTrackCode: string | null;
  status: { id: number; name: string };
  flight: { id: number; name: string } | null;
  weight: number | null;
  price: number | null;
  paid: boolean;
  createdAt: string;
};

export type IPartnerDeclarationPersistence = {
  id: number;
  user_id: number;
  user_name: string;
  partner_id: number | null;
  partner_name: string | null;
  track_code: string;
  global_track_code: string | null;
  state_id: number;
  state_name: string;
  flight_id: number | null;
  flight_name: string | null;
  weight: string | null;
  price: string | null;
  payed: number;
  created_at: string;
};
