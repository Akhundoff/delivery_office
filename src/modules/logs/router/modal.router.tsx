import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { LogDetail } from "../containers";

export const LogsModalRouter: FC = () => (
  <Routes>
    <Route path=":id/detail" element={<LogDetail />} />
  </Routes>
);

export default LogsModalRouter;
