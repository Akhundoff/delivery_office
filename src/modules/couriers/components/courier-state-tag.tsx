import React from 'react';
import { Tag } from 'antd';

const COLOR_MAP: Record<number, string> = {
  11: 'red',
  12: 'orange',
  13: 'blue',
  14: 'green',
};

export const CourierStateTag: React.FC<{ id: number; name: string }> = ({ id, name }) => <Tag color={COLOR_MAP[id]}>{name}</Tag>;
