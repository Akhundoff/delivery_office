import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { BoxTransfersTableContext } from '../context';
import { useBoxTransfersTable } from '../hooks';

export const BoxTransfersTable: FC = () => {
    const { columns } = useBoxTransfersTable();
    return <NextTable context={BoxTransfersTableContext} columns={columns} />;
};
