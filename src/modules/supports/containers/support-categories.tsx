import { FC, useCallback, useMemo, useState } from 'react';
import { Button, Checkbox, Form, Input, List, Modal, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import { useQueryClient } from 'react-query';
import { useCloseModal } from '@shared/hooks';
import { SupportsService } from '../services';
import { useSupportCategories } from '../hooks';
import { ICreateSupportCategoryFormValues, ISupportCategory } from '../interfaces';

export const SupportCategories: FC = () => {
  const [closeModal] = useCloseModal();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<ISupportCategory>();
  const { data, isLoading } = useSupportCategories();

  const initialValues = useMemo<ICreateSupportCategoryFormValues>(
    () => (selectedItem ? { id: String(selectedItem.id), name: selectedItem.name, hidden: selectedItem.hidden } : { name: '', hidden: false }),
    [selectedItem],
  );

  const onSubmit = useCallback(
    async (values: ICreateSupportCategoryFormValues) => {
      const result = await SupportsService.createCategory(values);
      if (result.status === 200) {
        await queryClient.invalidateQueries(['supports', 'categories']);
        setSelectedItem(undefined);
      } else {
        message.error(result.data as string);
      }
    },
    [queryClient],
  );

  const { values, handleBlur, handleChange, submitForm, isSubmitting } = useFormik<ICreateSupportCategoryFormValues>({ enableReinitialize: true, initialValues, onSubmit });

  return (
    <Modal width={576} open footer={null} onCancel={() => closeModal('/supports')} title="Müraciət kateqoriyaları">
      <Form size="large" style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <Input style={{ flex: 1, marginRight: 12 }} name="name" placeholder="Kateqoriya adını daxil edin..." value={values.name} onBlur={handleBlur} onChange={handleChange} />
        <Checkbox style={{ marginRight: 8 }} name="hidden" checked={values.hidden} onChange={handleChange}>
          Gizli
        </Checkbox>
        <Button loading={isSubmitting} onClick={submitForm} type="primary">
          {selectedItem ? 'Dəyişdir' : 'Yarat'}
        </Button>
        {selectedItem && (
          <Button onClick={() => setSelectedItem(undefined)} type="link">
            Ləğv et
          </Button>
        )}
      </Form>
      <List
        loading={isLoading}
        dataSource={data?.data || []}
        renderItem={(item: ISupportCategory) => (
          <List.Item actions={[<EditOutlined onClick={() => setSelectedItem(item)} key="edit-action" />]} key={item.id}>
            <List.Item.Meta title={item.name} description={item.hidden ? 'Gizlidir' : 'Gizli deyil'} />
          </List.Item>
        )}
      />
    </Modal>
  );
};
