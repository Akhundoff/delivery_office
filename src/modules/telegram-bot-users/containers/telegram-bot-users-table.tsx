import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { TelegramBotUsersTableContext } from '../context';
import { useTelegramBotUsersTable } from '../hooks';

export const TelegramBotUsersTable: FC = () => {
  const { columns } = useTelegramBotUsersTable();
  return <NextTable context={TelegramBotUsersTableContext} columns={columns} />;
};
