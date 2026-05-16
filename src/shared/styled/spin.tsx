import React, { FC } from 'react';
import { Flex, Spin } from 'antd';

export const SuspenseSpin: FC = () => {
    return (
        <Flex align='center' justify='center' style={{ minHeight: '100vh' }}>
            <Spin size='large' />
        </Flex>
    );
};
