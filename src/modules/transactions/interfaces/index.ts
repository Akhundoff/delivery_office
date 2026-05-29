export type ITransaction = {
  id: number;
  user: { id: number; name: string };
  object: { id: number; model: { id: number; name: string } };
  amount: { value: number; currency: string };
  beforeBalance: string;
  cashback: number;
  paymentType: { id: number; name: string };
  type: { id: number; name: string };
  status: { id: number; name: string };
  confirmedBy: { id: number; name: string } | null;
  createdAt: string;
  description: string;
};

export type ITransactionPersistence = {
  id: number;
  user_id: number;
  user_name: string;
  object_id: number;
  model_id: number;
  model_name: string;
  amount: string;
  currency: string;
  before_balance: number | null;
  cashback: number;
  payment_type: number;
  payment_type_name: string;
  type: number;
  type_name: string;
  state_id: number;
  state_name: string;
  confirmed_by: string | null;
  created_at: string;
  descr: string | null;
};

export type ITransactionsStats = {
  try: { in: number; out: number; difference: number };
  usd: { in: number; out: number; difference: number };
};

export type ITransactionsStatsPersistence = {
  try_in: string;
  try_out: string;
  usd_in: number;
  usd_out: number;
};

export type CreateTransactionDto = {
  userId: string;
  amount: string;
  currency: string;
  amountAzn: string;
  type: string;
  paymentType: string;
  description: string;
};
