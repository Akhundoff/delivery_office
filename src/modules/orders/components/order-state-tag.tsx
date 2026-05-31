import { FC } from 'react';
import { Tag } from 'antd';

const COLORS: Record<number, string> = {
  1: 'orange',
  2: 'blue',
  3: 'green',
  4: 'red',
};

export const OrderStateTag: FC<{ id: number; name: string }> = ({ id, name }) => <Tag color={COLORS[id]}>{name}</Tag>;
