import { FC, useEffect } from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { useCloseModal } from '@shared/hooks';
import { IDnsQueue } from '../interfaces';

export const DnsQueuesQueryPreview: FC = () => {
  const location = useLocation();
  const dnsQueue = location.state?.dnsQueue as IDnsQueue | undefined;
  const [closeModal] = useCloseModal();

  useEffect(() => {
    if (!dnsQueue) closeModal('/customs/dns-queues');
  }, [dnsQueue, closeModal]);

  if (!dnsQueue) return null;

  return (
    <Modal open={true} onCancel={() => closeModal('/customs/dns-queues')} footer={null} width={768} closable={false}>
      <ReactJson src={dnsQueue.query} />
    </Modal>
  );
};
