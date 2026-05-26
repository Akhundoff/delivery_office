import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';

import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { StatusesService } from '../../services';
import { IStatusFormValues } from '../../interfaces';

const emptyValues: IStatusFormValues = {
    name: '',
    nameEn: '',
    modelId: '',
    parentId: '',
    description: '',
};

export const useStatusForm = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useBackgroundNavigate();

    const detail = useQuery(
        ['statuses', id],
        async () => {
            const result = await StatusesService.getById(id!);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { enabled: !!id },
    );

    const initialValues = useMemo<IStatusFormValues>(() => {
        if (id && detail.data) {
            const d = detail.data;
            return {
                name: d.name,
                nameEn: d.nameEn,
                modelId: d.model ? String(d.model.id) : '',
                parentId: d.parentId ? String(d.parentId) : '',
                description: d.description,
            };
        }
        return emptyValues;
    }, [id, detail.data]);

    const onSubmit = useCallback(
        async (values: IStatusFormValues, helpers: FormikHelpers<IStatusFormValues>) => {
            const result = id ? await StatusesService.update(id, values) : await StatusesService.create(values);

            if (result.status === 200) {
                message.success(id ? 'Dəyişikliklər saxlanıldı' : 'Status yaradıldı');
                navigate(localURLMaker('/status', {}, { reFetchStatusesTable: '1' }));
            } else if (result.status === 422) {
                const raw = result.data as Record<string, string[]>;
                const errors: Record<string, string> = {};
                Object.entries(raw).forEach(([k, v]) => {
                    errors[k] = Array.isArray(v) ? v.join(', ') : String(v);
                });
                helpers.setErrors(errors);
            } else {
                message.error((result.data as string) || 'Xəta baş verdi');
            }
            helpers.setSubmitting(false);
        },
        [id, navigate],
    );

    return {
        initialValues,
        onSubmit,
        id,
        isLoading: !!id && (detail.isLoading || !detail.data),
    };
};
