import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { TelegramBotUsersTableContext } from '../context';
import { telegramBotUsersTableFetchUseCase } from '../use-cases/table-fetch';
import { TelegramBotUsersActionBar, TelegramBotUsersTable } from '../containers';

export const TelegramBotUsersPage: FC = () => (
  <PageContent $contain={true}>
    <NextTableProvider context={TelegramBotUsersTableContext} onFetch={telegramBotUsersTableFetchUseCase} name="telegram-bot-users-table">
      <TelegramBotUsersActionBar />
      <TelegramBotUsersTable />
    </NextTableProvider>
  </PageContent>
);
