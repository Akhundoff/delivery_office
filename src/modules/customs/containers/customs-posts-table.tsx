import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { CustomsPostsTableContext } from '../context';
import { useCustomsPostsTable } from '../hooks';

export const CustomsPostsTable: FC = () => {
    const { columns } = useCustomsPostsTable();
    return <NextTable context={CustomsPostsTableContext} columns={columns} filterable={false} sortable={false} />;
};
