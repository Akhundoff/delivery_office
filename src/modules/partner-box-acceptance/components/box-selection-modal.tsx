import { FC, useCallback, useState } from 'react';
import { Modal, Select, message } from 'antd';
import { usePartnerBoxes } from '@modules/partner-boxes';

interface BoxSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onOk: (boxId: string) => void;
}

export const BoxSelectionModal: FC<BoxSelectionModalProps> = ({ visible, onClose, onOk }) => {
  const [boxId, setBoxId] = useState<string | undefined>(undefined);
  const partnerBoxes = usePartnerBoxes();

  const onSubmit = useCallback(() => {
    if (!boxId) { message.error('Yeşik seçin.'); return; }
    onOk(boxId);
    onClose();
  }, [boxId, onOk, onClose]);

  return (
    <Modal open={visible} width={576} onOk={onSubmit} onCancel={onClose} title='Yeşik seçimi' okText='Seç' cancelText='Ləğv et'>
      <Select showSearch style={{ width: '100%' }} placeholder='Yeşik seçin' loading={partnerBoxes.isLoading} onSelect={(v: string) => setBoxId(v)}>
        {(partnerBoxes.data || []).map((box) => (
          <Select.Option key={box.id} value={String(box.id)}>{box.name}</Select.Option>
        ))}
      </Select>
    </Modal>
  );
};
