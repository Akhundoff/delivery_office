import { FC, useCallback } from 'react';
import { Formik, FormikProps } from 'formik';
import { Modal, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField } from '@shared/modules/form/fields/text';
import { TextAreaField } from '@shared/modules/form/fields/textarea';
import { ICreateTicketTemplateDto } from '../interfaces';
import { TicketTemplatesService } from '../services';
import { useQuery } from 'react-query';

const emptyValues: ICreateTicketTemplateDto = {
    name: '',
    body: '',
};

const FormikComponent: FC<FormikProps<ICreateTicketTemplateDto> & { onClose: () => void }> = ({
    values,
    handleSubmit,
    isSubmitting,
    onClose,
}) => (
    <Modal
        open
        width={768}
        onOk={() => handleSubmit()}
        onCancel={onClose}
        confirmLoading={isSubmitting}
        title={values.id ? 'Mürəciət şablonunda düzəliş et' : 'Yeni mürəciət şablonu əlavə et'}
    >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            <TextField name='name' item={{ label: 'Başlıq' }} input={{ placeholder: 'Başlıq daxil edin...' }} />
            <TextAreaField name='body' item={{ label: 'Mətn' }} input={{ placeholder: 'Bildiriş mətnini daxil edin...' }} />
        </div>
    </Modal>
);

export const CreateTicketTemplate: FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();

    const onClose = useCallback(() => navigate(-1), [navigate]);

    const templateQuery = useQuery(
        ['ticket-templates', 'item', id],
        () => TicketTemplatesService.getById(id!),
        { enabled: !!id },
    );

    const handleSubmit = useCallback(
        async (values: ICreateTicketTemplateDto) => {
            const result = await TicketTemplatesService.create(values);
            if (result.status === 200) {
                message.success(id ? 'Şablon yeniləndi.' : 'Şablon yaradıldı.');
                navigate('/ticket-templates');
            } else {
                message.error('Xəta baş verdi.');
            }
        },
        [id, navigate],
    );

    if (id && templateQuery.isLoading) return null;

    const tpl = templateQuery.data?.status === 200 ? templateQuery.data.data : null;
    const initialValues: ICreateTicketTemplateDto = tpl ? { id: tpl.id, name: tpl.name, body: tpl.body } : emptyValues;

    return (
        <Formik<ICreateTicketTemplateDto>
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
            component={(props) => <FormikComponent {...props} onClose={onClose} />}
        />
    );
};
