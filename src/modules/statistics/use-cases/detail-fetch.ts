import { Dispatch } from 'react';
import {
    nextTableFetchDataFailedAction,
    nextTableFetchDataStartedAction,
    nextTableFetchDataSucceedAction,
} from '@shared/modules/next-table/context/actions';
import { NextTableActions } from '@shared/modules/next-table/context/action-types';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { StatisticsService } from '../services';

// Builds a NextTable `onFetch` that hits a statistics "getlist" endpoint with the drill-down
// params baked in, then maps each raw row into the relevant module's domain object so the
// reused module columns render correctly.
export const makeDetailFetchUseCase = <T>(path: string, extraQuery: Record<string, any>, mapRow: (row: any) => T) =>
    (params: NextTableFetchParams) =>
    async (dispatch: Dispatch<NextTableActions>) => {
        dispatch(nextTableFetchDataStartedAction());
        const result = await StatisticsService.getGetlist(path, { ...extraQuery, ...tableQueryMaker(params) });
        if (result.status === 200) {
            dispatch(nextTableFetchDataSucceedAction({ data: result.data.data.map(mapRow), total: result.data.total }));
        } else {
            dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
        }
    };
