import React, { FC } from 'react';
import { Tag } from 'antd';

const statusColors: Record<number, string> = {
    5: 'orange',
    7: 'purple',
    8: 'blue',
    9: 'lime',
    10: 'green',
    32: 'red',
};

export const DeclarationStatusTag: FC<{ id: number; name: string }> = ({ id, name }) => (
    <Tag color={statusColors[id]}>{name}</Tag>
);
