export type IStatusMapItem = {
  id: number;
  descr: string;
  createdAt: string;
  state: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
  };
};

export type IStatusMapItemPersistence = {
  id: number;
  descr: string;
  created_at: string;
  state_id: number;
  state_name: string;
  user_id: number;
  user_name: string;
};
