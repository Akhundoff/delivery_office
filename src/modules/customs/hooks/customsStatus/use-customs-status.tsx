import { useCallback, useMemo, useRef } from 'react';
import { useQuery } from 'react-query';
import * as Icons from '@ant-design/icons';
import { CustomsService } from '../../services';

export const useCustomsStatus = () => {
    const lastRequestTimeRef = useRef(0);

    const { data, isLoading, isFetching, refetch } = useQuery(['customs', 'status'], async () => {
        const result = await CustomsService.getStatus();
        return result.data;
    });

    const handleMouseEnter = useCallback(() => {
        if (isFetching) return;
        const now = Date.now();
        if (now - lastRequestTimeRef.current < 3000) return;
        lastRequestTimeRef.current = now;
        refetch();
    }, [isFetching, refetch]);

    const status = useMemo(() => (data?.status ? data.status : isLoading ? 'processing' : 'warning'), [data?.status, isLoading]);

    const icon = useMemo(() => {
        switch (status) {
            case 'success':
                return <Icons.CheckCircleOutlined />;
            case 'error':
                return <Icons.CloseCircleOutlined />;
            case 'warning':
                return <Icons.ExclamationCircleOutlined />;
            default:
                return <Icons.SyncOutlined spin={true} />;
        }
    }, [status]);

    const title = useMemo(() => {
        switch (status) {
            case 'success':
                return 'İşləkdir';
            case 'error':
                return 'İşlək deyil';
            case 'warning':
                return 'Təyin olunmayıb';
            default:
                return 'Gözlənilir';
        }
    }, [status]);

    return { title, status, icon, handleMouseEnter };
};
