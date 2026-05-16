import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { DeclarationsTableContext } from '../context';
import { useDeclarationsTable } from '../hooks';

export const DeclarationsTable: FC = () => {
    const { columns, getRowProps } = useDeclarationsTable();

    return <NextTable context={DeclarationsTableContext} columns={columns} getRowProps={getRowProps} />;
};
