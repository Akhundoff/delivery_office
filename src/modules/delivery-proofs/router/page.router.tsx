import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { DeliveryProofsPage } from "../pages";

export const DeliveryProofsRouter: FC = () => (
  <Routes>
    <Route index element={<DeliveryProofsPage />} />
  </Routes>
);

export default DeliveryProofsRouter;
