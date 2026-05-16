import { useMemo } from 'react';

export const useSelection = (selectedRowIds: Record<string | number, boolean>) =>
    useMemo(() => Object.keys(selectedRowIds), [selectedRowIds]);
