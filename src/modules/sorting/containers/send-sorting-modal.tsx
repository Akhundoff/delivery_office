import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Modal, message } from 'antd';
import { useCloseModal } from '@shared/hooks';
import { SortingService } from '../services';

export const SendSortingModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [closeModal] = useCloseModal();
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => closeModal('/sorting');

  const handleOk = async () => {
    setLoading(true);
    const result = await SortingService.sendToAzeriExpress(id!, note);
    setLoading(false);
    if (result.status === 200) {
      message.success(result.data as string);
      handleClose();
    } else {
      message.error(result.data as string);
    }
  };

  return (
    <Modal open={true} title="AzəriExpress-ə göndər" onCancel={handleClose} onOk={handleOk} confirmLoading={loading} okText="Göndər" cancelText="Ləğv et" width={500}>
      <Input.TextArea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Qeyd daxil edin..." rows={4} style={{ marginTop: 8 }} />
    </Modal>
  );
};
