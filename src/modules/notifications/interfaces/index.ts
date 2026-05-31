import type { ArgsProps } from 'antd/es/notification';

export type NotificationContextType = {
  success: (config: ArgsProps) => void;
  error: (config: ArgsProps) => void;
  info: (config: ArgsProps) => void;
  warning: (config: ArgsProps) => void;
  open: (config: ArgsProps) => void;
  destroy: () => void;
};
