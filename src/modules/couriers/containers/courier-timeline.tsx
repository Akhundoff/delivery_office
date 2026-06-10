import { FC } from 'react';
import { Modal, Steps } from 'antd';
import { useParams } from 'react-router-dom';
import { useCloseModal } from '@shared/hooks';
import { useCourierTimeline } from '../hooks';

export const CourierTimeline: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useCourierTimeline(id!);
  const [close] = useCloseModal();

  return (
    <Modal
      title='Status xəritəsi'
      open={true}
      footer={null}
      onCancel={() => close('/couriers')}
      width={640}
    >
      <Steps
        direction='vertical'
        size='small'
        items={data.map((item) => ({
          title: item.name,
          description: item.date && item.executor ? `Kuryer "${item.date}" tarixində "${item.executor}" tərəfindən "${item.name}" statusuna keçirilmişdir` : '',
        }))}
      />
    </Modal>
  );
};
