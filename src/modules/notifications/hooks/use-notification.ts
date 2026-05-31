import { useContext } from 'react';
import { NotificationContext } from '../context';
import { NotificationContextType } from '../interfaces';

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
