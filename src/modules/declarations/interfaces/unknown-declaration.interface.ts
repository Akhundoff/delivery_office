export type IUnknownDeclaration = {
  id: number;
  globalTrackCode: string;
  trackCode: string;
  status: { id: number; name: string };
  user: { id: number; name: string } | null;
  weight: number | null;
  price: number | null;
  createdAt: string;
};

export type IUnknownDeclarationPersistence = {
  id: number;
  global_track_code: string;
  track_code: string;
  state_id: number;
  state_name: string;
  user_id: number | null;
  user_name: string | null;
  weight: string | null;
  price: string | null;
  created_at: string;
};
