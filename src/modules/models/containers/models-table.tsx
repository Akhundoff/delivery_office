import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { ModelsTableContext } from '../context';
import { useModelsTable } from '../hooks';

export const ModelsTable: FC = () => {
  const { columns } = useModelsTable();
  return <NextTable context={ModelsTableContext} columns={columns} filterable={false} sortable={false} pagination={false} />;
};
