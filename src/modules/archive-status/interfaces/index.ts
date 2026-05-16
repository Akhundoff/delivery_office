export type IArchiveStatus = {
  id: number;
  user: { id: number; name: string } | null;
  model: { id: number; name: string } | null;
  objectId: number;
  state: { id: number; name: string } | null;
  createdAt: string;
};
