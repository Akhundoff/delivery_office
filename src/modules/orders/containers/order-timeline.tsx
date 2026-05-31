import React, { FC, useCallback } from 'react';
import { Button, Modal, Steps } from 'antd';
import * as Icons from '@ant-design/icons';
import { useParams } from 'react-router-dom';

import { useBackgroundNavigate, useCloseModal } from '@shared/hooks';

import { useOrderStates } from '../hooks';

export const OrderTimeline: FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [closeModal] = useCloseModal();
  const navigate = useBackgroundNavigate();
  const { data } = useOrderStates(id);

  const makeStatus = useCallback((isCurrent: boolean, date: string | null): 'process' | 'finish' | 'wait' => {
    return isCurrent ? 'process' : date ? 'finish' : 'wait';
  }, []);

  const makeDescription = useCallback((date: string | null, executor?: string, name?: string) => {
    if (!date || !executor) return undefined;
    return `Sifariş "${date}" tarixində "${executor}" tərəfindən "${name}" statusuna keçirilmişdir`;
  }, []);

  const onClose = useCallback(() => closeModal(`/orders/${id}`), [closeModal, id]);

  const openLogs = useCallback(() => {
    navigate(`/logs?object_id=${id}&model_id=1`, { withBackground: false });
  }, [id, navigate]);

  const footer = (
    <React.Fragment>
      <Button onClick={openLogs} icon={<Icons.HistoryOutlined />}>
        Əməliyyat tarixçəsi
      </Button>
    </React.Fragment>
  );

  return (
    <Modal open={true} width={576} onCancel={onClose} footer={footer} title='Status xəritəsi'>
      <Steps progressDot direction='vertical'>
        {(data || []).map((item) => (
          <Steps.Step
            key={item.id}
            status={makeStatus(item.isCurrent, item.createdAt)}
            title={item.ref.name}
            subTitle={item.executor?.name}
            description={makeDescription(item.createdAt, item.executor?.name, item.ref.name)}
          />
        ))}
      </Steps>
    </Modal>
  );
};
