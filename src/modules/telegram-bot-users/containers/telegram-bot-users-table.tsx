import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { TelegramBotUsersTableContext } from '../context';
import { useTelegramBotUsersTableColumns } from '../hooks';

export const TelegramBotUsersTable: FC = () => {
  const columns = useTelegramBotUsersTableColumns();
  return <NextTable context={TelegramBotUsersTableContext} columns={columns} />;
};
