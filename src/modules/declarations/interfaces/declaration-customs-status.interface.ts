export type IDeclarationCustomsStatus = {
  customsStatus: number | null;
  json: object;
};

export type IDeclarationCustomsStatusPersistence = {
  customs_status: number | null;
  json: object | null;
};

export type IParcelStates = {
  state: string;
  comment: string;
  author: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type IParcelStatesPersistence = {
  state: string;
  comment: string;
  author: string;
  _id: string;
  created_at: string;
  updated_at: string;
};
