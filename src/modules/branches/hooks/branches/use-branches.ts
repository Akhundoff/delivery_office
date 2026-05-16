import { useQuery } from 'react-query';
import { caller, urlMaker } from '@shared/utils';

export type IBranch = { id: number; name: string };

const fetchBranches = async (): Promise<IBranch[]> => {
    const url = urlMaker('/api/admin/branches/select');
    const response = await caller(url);
    if (!response.ok) throw new Error('Filiallar əldə edilə bilmədi');
    const result = await response.json();
    return (result.data || []).map((b: { id: number; branch_name: string }) => ({ id: b.id, name: b.branch_name }));
};

export const useBranches = () => {
    return useQuery<IBranch[], Error>(['branches-select'], fetchBranches, {
        staleTime: 5 * 60 * 1000,
    });
};
