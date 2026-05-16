import React, { FC } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const TooltipLabel: FC<{ label: string; message: string }> = ({ label, message }) => {
  return (
    <span>
      {label}&nbsp;
      <Tooltip title={message}>
        <QuestionCircleOutlined />
      </Tooltip>
    </span>
  );
};
