import { FC, useEffect } from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { useCloseModal } from '@shared/hooks';
import { IFailedJob } from '../interfaces';

export const FailedJobsPreview: FC = () => {
  const location = useLocation();
  const failedJob = location.state?.failedJob as IFailedJob | undefined;
  const [closeModal] = useCloseModal();

  useEffect(() => {
    if (!failedJob?.dispatchData) closeModal('/failed-jobs');
  }, [failedJob, closeModal]);

  if (!failedJob?.dispatchData) return null;

  return (
    <Modal open={true} onCancel={() => closeModal('/failed-jobs')} footer={null} width={768} closable={false}>
      <ReactJson src={failedJob.dispatchData} />
    </Modal>
  );
};
