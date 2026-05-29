import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HandoverQueuesPage, HandoverHistoryPage, HandoverQueueDetailsPage } from '../pages';

const WarehousePageRouter: FC = () => (
    <Routes>
        <Route path='handover/queues' element={<HandoverQueuesPage />} />
        <Route path='handover/queues/:queueId' element={<HandoverQueueDetailsPage />} />
        <Route path='handover/history' element={<HandoverHistoryPage />} />
    </Routes>
);

export default WarehousePageRouter;
