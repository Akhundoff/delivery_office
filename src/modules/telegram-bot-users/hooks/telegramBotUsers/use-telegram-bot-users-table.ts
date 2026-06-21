import { useTelegramBotUsersTableColumns } from './use-telegram-bot-users-table-columns';

export const useTelegramBotUsersTable = () => {
  const columns = useTelegramBotUsersTableColumns();
  return { columns };
};
