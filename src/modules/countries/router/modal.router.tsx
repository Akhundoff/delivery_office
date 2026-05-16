import { Route, Routes } from "react-router-dom";
import { CreateCountry } from "../containers";

const CountriesModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateCountry />} />
    <Route path=":id/update" element={<CreateCountry />} />
  </Routes>
);

export default CountriesModalRouter;
