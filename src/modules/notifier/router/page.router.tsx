import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
    SmsNotificationsPage,
    WhatsappNotificationsPage,
    EmailNotificationsPage,
    NotificationTemplatesPage,
    SendBulkMobileNotificationsPage,
    SmsNotificationsQueuePage,
    EmailNotificationsQueuePage,
    WhatsappNotificationsQueuePage,
    SendBulkSmsNotificationsPage,
    SendBulkEmailNotificationsPage,
    SendBulkWhatsappNotificationsPage,
    CreateNotificationTemplatePage,
    NotificationTemplateDetailsPage,
} from '../pages';

export const NotifierRouter: FC = () => (
    <Routes>
        <Route path='sms' element={<SmsNotificationsPage />} />
        <Route path='whatsapp' element={<WhatsappNotificationsPage />} />
        <Route path='email' element={<EmailNotificationsPage />} />
        <Route path='mobile/bulk/send' element={<SendBulkMobileNotificationsPage />} />
        <Route path='templates' element={<NotificationTemplatesPage />} />
        <Route path='templates/create' element={<CreateNotificationTemplatePage />} />
        <Route path='templates/:id' element={<NotificationTemplateDetailsPage />} />
        <Route path='templates/:id/update' element={<CreateNotificationTemplatePage />} />
        <Route path='queue-sms' element={<SmsNotificationsQueuePage />} />
        <Route path='queue-email' element={<EmailNotificationsQueuePage />} />
        <Route path='queue-whatsapp' element={<WhatsappNotificationsQueuePage />} />
        <Route path='sms/bulk/send' element={<SendBulkSmsNotificationsPage />} />
        <Route path='email/bulk/send' element={<SendBulkEmailNotificationsPage />} />
        <Route path='whatsapp/bulk/send' element={<SendBulkWhatsappNotificationsPage />} />
    </Routes>
);

export default NotifierRouter;
