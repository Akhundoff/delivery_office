import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { UsersTableContext } from '../context';
import { useUsersTable } from '../hooks';

export const UsersTable: FC = () => {
    const { columns, getRowProps } = useUsersTable();

    return <NextTable context={UsersTableContext} columns={columns} getRowProps={getRowProps} />;
};
