import React, { FC } from 'react';
import { Button, Modal, Spin, Steps } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { useDeclarationTimeline } from '../hooks';

export const DeclarationTimeline: FC = () => {
    const { id = '' } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading } = useDeclarationTimeline(id);

    const close = () => navigate(-1);

    const items = (data || []).map((item) => ({
        status: (item.createdAt ? 'finish' : 'wait') as 'finish' | 'wait',
        title: item.state.name,
        subTitle: item.user.name,
        description:
            item.createdAt && item.user.name
                ? `Bağlama "${item.createdAt}" tarixində "${item.user.name}" tərəfindən "${item.state.name}" statusuna keçirilmişdir`
                : undefined,
    }));

    const footer = (
        <>
            <Button onClick={() => navigate(`/logs?object_id=${id}&model_id=2`)} icon={<Icons.HistoryOutlined />}>
                Əməliyyat tarixçəsi
            </Button>
            <Button onClick={() => navigate(`/archive-status?object_id=${id}&model_id=2`)} icon={<Icons.FieldTimeOutlined />}>
                Status tarixçəsi
            </Button>
        </>
    );

    return (
        <Modal open={true} width={576} onCancel={close} footer={footer} title='Status xəritəsi'>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
                    <Spin />
                </div>
            ) : (
                <Steps progressDot direction='vertical' items={items} />
            )}
        </Modal>
    );
};
