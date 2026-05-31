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

export const qizilOnluqTableFetchUseCase = (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
    dispatch(nextTableFetchDataStartedAction());
    const result = await StatisticsService.getQizilOnluqUsers(tableQueryMaker(params));
    if (result.status === 200) {
        dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
    } else {
        dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
    }
};
