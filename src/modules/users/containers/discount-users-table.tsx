import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { DiscountUsersTableContext } from '../context';
import { useDiscountUsersTable } from '../hooks';

export const DiscountUsersTable: FC = () => {
    const { columns, getRowProps } = useDiscountUsersTable();

    return <NextTable context={DiscountUsersTableContext} columns={columns} getRowProps={getRowProps} />;
};
