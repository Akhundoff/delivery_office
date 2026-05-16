import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateFaq } from "../containers";

export const FaqModalRouter: FC = () => (
  <Routes>
    <Route path="create" element={<CreateFaq />} />
    <Route path=":id/update" element={<CreateFaq />} />
  </Routes>
);

export default FaqModalRouter;
