import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateNews } from "../containers";

export const NewsModalRouter: FC = () => (
  <Routes>
    <Route path="create" element={<CreateNews />} />
    <Route path=":id/update" element={<CreateNews />} />
  </Routes>
);

export default NewsModalRouter;
