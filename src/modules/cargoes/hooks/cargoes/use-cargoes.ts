import { useQuery } from 'react-query';
import { caller, urlMaker } from '@shared/utils';

export type ICargoDrop = { id: number; name: string };

const fetchCargoes = async (): Promise<ICargoDrop[]> => {
    const url = urlMaker('/api/admin/cargoes', { page: 1, per_page: 200 });
    const response = await caller(url);
    if (!response.ok) throw new Error('Kargolar əldə edilə bilmədi');
    const result = await response.json();
    return (result.data || []).map((c: any) => ({ id: c.id, name: c.cargo_name || c.name || '' }));
};

export const useCargoes = () => {
    return useQuery<ICargoDrop[], Error>(['cargoes-select'], fetchCargoes, {
        staleTime: 5 * 60 * 1000,
    });
};
