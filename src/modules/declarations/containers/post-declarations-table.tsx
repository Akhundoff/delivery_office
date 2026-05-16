import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { PostDeclarationsTableContext } from '../context';
import { usePostDeclarationsTable } from '../hooks';

export const PostDeclarationsTable: FC = () => {
    const { columns } = usePostDeclarationsTable();
    return <NextTable context={PostDeclarationsTableContext} columns={columns} filterable={false} sortable={false} />;
};
