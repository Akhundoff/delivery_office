import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateBanner } from "../containers";

export const BannersModalRouter: FC = () => (
  <Routes>
    <Route path="create" element={<CreateBanner />} />
    <Route path=":id/update" element={<CreateBanner />} />
  </Routes>
);

export default BannersModalRouter;
