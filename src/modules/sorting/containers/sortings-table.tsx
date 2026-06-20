import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NextTable } from '@shared/modules/next-table/containers';
import { SortingsTableContext } from '../context';
import { useSortingsTableColumns } from '../hooks';

export const SortingsTable: FC = () => {
  const columns = useSortingsTableColumns();
  const nav = useNavigate();
  const getRowProps = useCallback((id: number | string) => ({ onDoubleClick: () => nav(`/sorting/${id}`) }), [nav]);
  return <NextTable context={SortingsTableContext} columns={columns} getRowProps={getRowProps} />;
};
