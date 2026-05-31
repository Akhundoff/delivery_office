import { FC, useMemo } from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { NextTable } from '@shared/modules/next-table/containers';
import { useCloseModal } from '@shared/hooks';
import { UsersTableContext } from '@modules/users/context';
import { useUsersTableColumns } from '@modules/users/hooks/users/use-users-table-columns';
import { UserMapper } from '@modules/users/mappers/user.mapper';
import { makeDetailFetchUseCase } from '../use-cases/detail-fetch';

const UsersDetailTable: FC = () => {
    const columns = useUsersTableColumns();
    return <NextTable context={UsersTableContext} columns={columns} />;
};

export const UsersCountDetailsModal: FC = () => {
    const [close] = useCloseModal();
    const { dateFrom, dateTo, gender, ageFrom, ageTo } = (useLocation().state || {}) as any;

    const onFetch = useMemo(
        () =>
            makeDetailFetchUseCase(
                '/api/admin/statistics/by_user_count',
                { start_date: dateFrom, end_date: dateTo, gender, start_age: ageFrom, end_age: ageTo },
                (row: any) => UserMapper.toDomain(row),
            ),
        [dateFrom, dateTo, gender, ageFrom, ageTo],
    );

    return (
        <Modal open onCancel={() => close('/statistics/users/counts')} footer={null} width='100%' closable={false}>
            <NextTableProvider context={UsersTableContext} onFetch={onFetch} name='stat-users-count-details' useCache={false}>
                <UsersDetailTable />
            </NextTableProvider>
        </Modal>
    );
};
