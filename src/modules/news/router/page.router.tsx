import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { NewsPage } from "../pages";

export const NewsRouter: FC = () => (
  <Routes>
    <Route index element={<NewsPage />} />
  </Routes>
);

export default NewsRouter;
