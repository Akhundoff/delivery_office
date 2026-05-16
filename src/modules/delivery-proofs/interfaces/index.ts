export type IDeliveryProof = {
  id: number;
  trackCode: number;
  declarationId: number;
  user: { id: number; name: string } | null;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
};
