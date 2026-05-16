import { FC, useEffect } from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { useCloseModal } from '@shared/hooks';
import { IUnitedQueue } from '../interfaces';

export const UnitedQueuesResponsePreview: FC = () => {
  const location = useLocation();
  const unitedQueue = location.state?.unitedQueue as IUnitedQueue | undefined;
  const [closeModal] = useCloseModal();

  useEffect(() => {
    if (!unitedQueue?.response) closeModal('/united-queues');
  }, [unitedQueue, closeModal]);

  if (!unitedQueue?.response) return null;

  return (
    <Modal open={true} onCancel={() => closeModal('/united-queues')} footer={null} width={768} closable={false}>
      <ReactJson src={unitedQueue.response} />
    </Modal>
  );
};
