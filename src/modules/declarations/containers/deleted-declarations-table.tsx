import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { DeletedDeclarationsTableContext } from '../context';
import { useDeletedDeclarationsTable } from '../hooks';

export const DeletedDeclarationsTable: FC = () => {
    const { columns } = useDeletedDeclarationsTable();
    return <NextTable context={DeletedDeclarationsTableContext} columns={columns} />;
};
