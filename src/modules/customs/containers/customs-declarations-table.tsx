import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { CustomsDeclarationsTableContext } from '../context';
import { useCustomsDeclarationsTable } from '../hooks';

export const CustomsDeclarationsTable: FC = () => {
    const { columns } = useCustomsDeclarationsTable();
    return <NextTable context={CustomsDeclarationsTableContext} columns={columns} filterable={false} sortable={false} />;
};
