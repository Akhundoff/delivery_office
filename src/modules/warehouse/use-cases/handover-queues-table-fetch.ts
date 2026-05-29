import { Dispatch } from 'react';
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from '@shared/modules/next-table/context/actions';
import { NextTableActions } from '@shared/modules/next-table/context/action-types';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { WarehouseService } from '../services';

export const handoverQueuesTableFetchUseCase = (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
    dispatch(nextTableFetchDataStartedAction());
    const result = await WarehouseService.getHandoverQueues(tableQueryMaker(params));
    if (result.status === 200) {
        dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
    } else {
        dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
    }
};
