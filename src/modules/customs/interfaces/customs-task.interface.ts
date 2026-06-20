export type ICustomsTask = {
  id: number;
  action: string;
  status: { id: number; name: string };
  createdAt: string;
  branch: { id: number; name: string };
  declaration: {
    id: number;
    trackCode: number;
    globalTrackCode: string;
    weight: number | null;
    quantity: number;
    basket: { id: number; name: string | null } | null;
    user: { id: number; name: string };
    status: { id: number; name: string };
    productType: { id: number; name: string };
    country: { id: number; name: string } | null;
    updatedBy: { id: number; name: string } | null;
  };
};

export type ICustomsTaskPersistence = {
  id: number;
  action: string;
  user_id: number;
  user_name: string;
  branch_id: number;
  branch_name: string;
  country_id: number;
  country_name: string;
  track_code: number;
  global_track_code: string;
  state_id: number;
  state_name: string;
  declaration_id: number;
  declaration_state_id: number;
  declaration_state_name: string;
  weight: string | null;
  quantity: number;
  basket_id: number | null;
  basket_name: string | null;
  product_type_id: number;
  product_type_name: string;
  changer_id: number | null;
  changer_name: string | null;
  created_at: string;
};
