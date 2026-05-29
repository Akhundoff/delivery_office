import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { BoxTransfersTableContext } from '../context';
import { boxTransfersTableFetchUseCase } from '../use-cases/box-transfers-table-fetch';
import { BoxTransfersActionBar, BoxTransfersTable } from '../containers';
import { BoxTransfersRequestType } from '../interfaces';

export const BoxTransfersPage: FC = () => {
    const { id, type } = useParams<{ id: string; type: BoxTransfersRequestType }>();

    return (
        <PageContent $contain>
            <NextTableProvider
                key={`${type}-${id}`}
                context={BoxTransfersTableContext}
                onFetch={boxTransfersTableFetchUseCase(id, (type as BoxTransfersRequestType) || 'branch')}
                name='box-transfers-table'
            >
                <BoxTransfersActionBar />
                <BoxTransfersTable />
            </NextTableProvider>
        </PageContent>
    );
};
