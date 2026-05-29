import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { CouriersTableContext } from '../context';
import { useCouriersTableColumns } from '../hooks';

export const CouriersTable: FC = () => {
  const columns = useCouriersTableColumns();

  return <NextTable context={CouriersTableContext} columns={columns} />;
};
