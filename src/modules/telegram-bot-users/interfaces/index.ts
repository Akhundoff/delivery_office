export type ITelegramBotUser = {
  id: number;
  telegram: {
    id: number | null;
    name: string | null;
  };
  user: {
    id: number | null;
  };
  hasAccess: boolean;
  createdAt: string;
  updatedAt: string;
};
