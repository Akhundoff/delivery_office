import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { TicketTemplatesPage, CreateTicketTemplatePage, TicketTemplateDetailsPage } from '../pages';

export const TicketTemplatesRouter: FC = () => (
    <Routes>
        <Route index element={<TicketTemplatesPage />} />
        <Route path='create' element={<CreateTicketTemplatePage />} />
        <Route path=':id' element={<TicketTemplateDetailsPage />} />
        <Route path=':id/update' element={<CreateTicketTemplatePage />} />
    </Routes>
);

export default TicketTemplatesRouter;
