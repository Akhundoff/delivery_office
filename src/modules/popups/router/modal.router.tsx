import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CreatePopup } from "../containers";

export const PopupsModalRouter: FC = () => (
  <Routes>
    <Route path="create" element={<CreatePopup />} />
    <Route path=":id/update" element={<CreatePopup />} />
  </Routes>
);

export default PopupsModalRouter;
