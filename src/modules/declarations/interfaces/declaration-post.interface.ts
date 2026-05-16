export type IDeclarationPostPersistence = {
  id: number;
  is_new: 1 | 0;
  price: string;
  dgk_price: string;
  user_id: number;
  user_name: string;
  track_code: number;
  declaration_id: number;
  customs_id: number;
  created_at: string;
};

export type IDeclarationPost = {
  id: number;
  read: boolean;
  price: number | null;
  dgkPrice: number | null;
  user: { id: number; name: string };
  trackCode: number;
  declarationId: number;
  customsId: number;
  createdAt: string;
};
