export type ICashback = {
  id: number;
  client: { id: number; name: string };
  amount: number;
  count: number;
  status: { id: number; name: string };
};
