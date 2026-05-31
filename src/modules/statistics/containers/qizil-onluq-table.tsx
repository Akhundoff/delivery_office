import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { QizilOnluqTableContext } from '../context/qizil-onluq';
import { useQizilOnluqTable } from '../hooks';

export const QizilOnluqTable: FC = () => {
    const { columns } = useQizilOnluqTable();
    return <NextTable context={QizilOnluqTableContext} columns={columns} />;
};
