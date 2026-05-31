import React, { createContext, FC, PropsWithChildren, useMemo } from 'react';
import { notification } from 'antd';
import { NotificationContextType } from '../interfaces';

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultConfig = {
  placement: 'topRight' as const,
  duration: 4.5,
};

export const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const methods = useMemo<NotificationContextType>(
    () => ({
      success: (config) => api.success({ ...defaultConfig, ...config }),
      error: (config) => api.error({ ...defaultConfig, ...config }),
      info: (config) => api.info({ ...defaultConfig, ...config }),
      warning: (config) => api.warning({ ...defaultConfig, ...config }),
      open: (config) => api.open({ ...defaultConfig, ...config }),
      destroy: () => api.destroy(),
    }),
    [api],
  );

  return (
    <NotificationContext.Provider value={methods}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
