import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { UnitedReturnsTableContext } from '../context';
import { useUnitedReturnsTable } from '../hooks';

export const UnitedReturnsTable: FC = () => {
  const { columns } = useUnitedReturnsTable();

  return <NextTable context={UnitedReturnsTableContext} columns={columns} />;
};
