import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { TelegramBotUsersPage } from '../pages';

export const TelegramBotUsersRouter: FC = () => (
  <Routes>
    <Route index element={<TelegramBotUsersPage />} />
  </Routes>
);

export default TelegramBotUsersRouter;
