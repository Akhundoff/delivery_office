import { Route, Routes } from 'react-router-dom';
import { CreatePartnerBox } from '../containers';

const PartnerBoxesModalRouter = () => (
  <Routes>
    <Route path='create' element={<CreatePartnerBox />} />
    <Route path=':id/update' element={<CreatePartnerBox />} />
  </Routes>
);

export default PartnerBoxesModalRouter;
