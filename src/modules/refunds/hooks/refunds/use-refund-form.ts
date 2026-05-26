import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';

import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { RefundsService } from '../../services';
import { IRefundFormValues } from '../../interfaces';

const emptyValues: IRefundFormValues = {
    userId: '',
    trackCode: '',
    cargoId: '',
    direction: '',
    refundNumber: '',
    productTypeName: '',
    shopName: '',
    quantity: '',
    price: '',
    description: '',
};

export const useRefundForm = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useBackgroundNavigate();

    const detail = useQuery(
        ['refunds', id],
        async () => {
            const result = await RefundsService.getById(id!);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { enabled: !!id },
    );

    const initialValues = useMemo<IRefundFormValues>(() => {
        if (id && detail.data) {
            const d = detail.data;
            return {
                userId: d.user ? String(d.user.id) : '',
                trackCode: d.trackCode,
                cargoId: d.cargo ? String(d.cargo.id) : '',
                direction: d.direction,
                refundNumber: d.refundNumber ? String(d.refundNumber) : '',
                productTypeName: d.productType?.name || '',
                shopName: d.shopName,
                quantity: d.quantity ? String(d.quantity) : '',
                price: d.price ? String(d.price) : '',
                description: d.description,
            };
        }
        return emptyValues;
    }, [id, detail.data]);

    const onSubmit = useCallback(
        async (values: IRefundFormValues, helpers: FormikHelpers<IRefundFormValues>) => {
            const result = id ? await RefundsService.update(id, values) : await RefundsService.create(values);

            if (result.status === 200) {
                message.success(id ? 'Dəyişikliklər saxlanıldı' : 'İadə yaradıldı');
                navigate(localURLMaker('/refunds', {}, { reFetchRefundsTable: '1' }));
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
