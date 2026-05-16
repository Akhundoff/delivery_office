import React, { FC } from 'react';
import { PageContent } from '@shared/styled/page-content';
import { Card } from 'antd';
import { CreateDiscount } from '../containers';

export const CreateDiscountPage: FC = () => {
    return (
        <PageContent>
            <Card title='Endirim əlavə et' style={{ maxWidth: 800, margin: '0 auto' }}>
                <CreateDiscount />
            </Card>
        </PageContent>
    );
};
