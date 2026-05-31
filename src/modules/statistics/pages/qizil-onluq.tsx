import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { QizilOnluqTableContext } from '../context/qizil-onluq';
import { qizilOnluqTableFetchUseCase } from '../use-cases/qizil-onluq-table-fetch';
import { QizilOnluqTable } from '../containers/qizil-onluq-table';
import { QizilOnluqActionBar } from '../containers/qizil-onluq-action-bar';

export const QizilOnluqPage: FC = () => (
    <PageContent $contain={true}>
        <NextTableProvider context={QizilOnluqTableContext} onFetch={qizilOnluqTableFetchUseCase} name='qizil-onluq-table'>
            <QizilOnluqActionBar />
            <QizilOnluqTable />
        </NextTableProvider>
    </PageContent>
);
