import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Col, List, Modal, Row, Select, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Formik, FormikHelpers } from 'formik';
import { useQuery, useQueryClient } from 'react-query';
import { TextField } from '@shared/modules/form/fields/text';
import { SelectField } from '@shared/modules/form/fields/select';
import { TextAreaField } from '@shared/modules/form/fields/textarea';
import { useCloseModal } from '@shared/hooks';
import { SettingsContext } from '@modules/settings';
import { PlansService } from '../services';
import { IPlanCategory, IPlanCategoryFormValues } from '../interfaces';

export const PlanCategoriesPage: FC = () => {
  const [closeModal] = useCloseModal();
  const queryClient = useQueryClient();
  const settings = useContext(SettingsContext);
  const [selectedItem, setSelectedItem] = useState<IPlanCategory>();

  const { data, isLoading } = useQuery(['plans', 'categories'], async () => {
    const result = await PlansService.getPlanCategories();
    if (result.status === 200) return result.data;
    return { data: [], total: 0 };
  });

  const onSubmit = useCallback(
    async (values: IPlanCategoryFormValues, actions: FormikHelpers<IPlanCategoryFormValues>) => {
      const result = await PlansService.createPlanCategory(values);
      if (result.status === 200) {
        await queryClient.invalidateQueries(['plans', 'categories']);
        setSelectedItem(undefined);
        actions.resetForm();
      } else {
        message.error(result.data as string);
      }
    },
    [queryClient],
  );

  const initialValues = useMemo<IPlanCategoryFormValues>(
    () =>
      selectedItem
        ? { id: String(selectedItem.id), name: selectedItem.name, countryId: selectedItem.countryId, description: selectedItem.description }
        : { id: '', name: '', countryId: null, description: '' },
    [selectedItem],
  );

  useEffect(() => {
    const modal = document.querySelector('.ant-modal-wrap');
    if (modal) modal.scrollTop = 0;
  }, [selectedItem]);

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
      {({ isSubmitting, handleSubmit }) => (
        <Modal width={576} open footer={null} onCancel={() => closeModal('/plans')} title="Xüsusi tariflər">
          <Row gutter={[10, 0]} style={{ marginBottom: 5 }}>
            <Col xs={24} md={12}>
              <TextField name="name" item={{ label: 'Ad' }} input={{ placeholder: 'Kateqoriya adını daxil edin...' }} />
            </Col>
            <Col xs={24} md={12}>
              <SelectField name="countryId" item={{ label: 'Ölkə' }} input={{ placeholder: 'Ölkə seçin...' }}>
                {(settings.data?.countries || []).map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </SelectField>
            </Col>
          </Row>
          <Row gutter={[10, 0]} style={{ marginBottom: 5 }}>
            <Col xs={24}>
              <TextAreaField name="description" input={{ placeholder: 'Açıqlamanı daxil edin...' }} />
            </Col>
          </Row>
          <Row gutter={[10, 0]} style={{ marginBottom: 30 }}>
            <Col md={24}>
              <Button loading={isSubmitting} type="primary" onClick={() => handleSubmit()}>
                {selectedItem ? 'Dəyişdir' : 'Yarat'}
              </Button>
              {selectedItem && (
                <Button onClick={() => setSelectedItem(undefined)} type="link">
                  Ləğv et
                </Button>
              )}
            </Col>
          </Row>
          <List
            loading={isLoading}
            dataSource={data?.data || []}
            renderItem={(item: IPlanCategory) => (
              <List.Item actions={[<EditOutlined onClick={() => setSelectedItem(item)} key="edit-action" />]} key={item.id}>
                <List.Item.Meta title={item.name} description={item.description} />
              </List.Item>
            )}
          />
        </Modal>
      )}
    </Formik>
  );
};
