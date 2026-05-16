import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { AboutPage } from "../pages";

export const AboutRouter: FC = () => (
  <Routes>
    <Route index element={<AboutPage />} />
  </Routes>
);

export default AboutRouter;
