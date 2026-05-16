export type IUnitedQueue = {
  id: number;
  method: string;
  url: string;
  statusCode: string | null;
  response: object | null;
  payload: object | null;
  attempts: number;
  createdAt: string;
  retriedAt: string | null;
};
