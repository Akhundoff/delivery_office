import { FC, useCallback, useContext } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DeclarationsService } from '../services';
import { DeclarationsTableContext } from '../context';

export const StuckAtCustomsModal: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const close = useCallback(() => navigate(-1), [navigate]);
  const { handleFetch, handleResetSelection } = useContext(DeclarationsTableContext);
  const [form] = Form.useForm();

  const ids = id?.split(',');
  const bulkQuery = (location.state as { bulkUpdateDeclarationsStatus?: { query: Record<string, any> } } | null)?.bulkUpdateDeclarationsStatus?.query;

  const onOk = async () => {
    const values = await form.validateFields();
    const result = ids ? await DeclarationsService.updateStatus(ids, 88, values.description) : await DeclarationsService.bulkUpdateStatus(bulkQuery || {}, 88, values.description);

    if (result.status === 200) {
      message.success('Status dəyişdirildi.');
      handleFetch();
      if (ids) handleResetSelection();
      close();
    } else {
      message.error(result.data as string);
    }
  };

  return (
    <Modal open={true} onCancel={close} onOk={onOk} title="Bağlamalar gömrükdə saxlanılıb" okText="Təsdiq et" cancelText="İmtina" width={576}>
      <Form form={form} layout="vertical">
        <Form.Item name="description" label="Gömrükdə saxlanılma səbəbi">
          <Input.TextArea rows={4} placeholder="Bağlamaların gömrükdə saxlanılma səbəbini qeyd edin..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
