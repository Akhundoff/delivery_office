import { FC, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MeContext } from '@modules/me/context/context';
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

export const NotifierRouter: FC = () => {
  const { can } = useContext(MeContext);
  return (
    <Routes>
      <Route path="templates/:id" element={<NotificationTemplateDetailsPage />} />
      {can('notification_templates') && <Route path="templates" element={<NotificationTemplatesPage />} />}
      {can('notification_templates') && <Route path="templates/create" element={<CreateNotificationTemplatePage />} />}
      {can('notification_templates') && <Route path="templates/:id/update" element={<CreateNotificationTemplatePage />} />}
      {can('sms_archive') && <Route path="sms" element={<SmsNotificationsPage />} />}
      {can('bulk_sms') && <Route path="sms/bulk/send" element={<SendBulkSmsNotificationsPage />} />}
      {can('whatsapp_archive') && <Route path="whatsapp" element={<WhatsappNotificationsPage />} />}
      {can('bulk_whatsapp') && <Route path="whatsapp/bulk/send" element={<SendBulkWhatsappNotificationsPage />} />}
      {can('mail_archive') && <Route path="email" element={<EmailNotificationsPage />} />}
      {can('bulk_mail') && <Route path="email/bulk/send" element={<SendBulkEmailNotificationsPage />} />}
      {can('bulk_app_notification') && <Route path="mobile/bulk/send" element={<SendBulkMobileNotificationsPage />} />}
      <Route path="queue-sms" element={<SmsNotificationsQueuePage />} />
      <Route path="queue-email" element={<EmailNotificationsQueuePage />} />
      <Route path="queue-whatsapp" element={<WhatsappNotificationsQueuePage />} />
    </Routes>
  );
};

export default NotifierRouter;
