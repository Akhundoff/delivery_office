import { FC, useEffect } from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { useCloseModal } from '@shared/hooks';
import { IAzerpostQueue } from '../interfaces';

export const AzerpostQueueRequestBodyPreview: FC = () => {
  const location = useLocation();
  const azerpostQueue = location.state?.azerpostQueue as IAzerpostQueue | undefined;
  const [closeModal] = useCloseModal();

  useEffect(() => {
    if (!azerpostQueue?.requestBody) closeModal('/azerpost-queues');
  }, [azerpostQueue, closeModal]);

  if (!azerpostQueue?.requestBody) return null;

  return (
    <Modal open={true} onCancel={() => closeModal('/azerpost-queues')} footer={null} width={768} closable={false}>
      <ReactJson src={{ body: JSON.parse(azerpostQueue.requestBody) }} />
    </Modal>
  );
};
