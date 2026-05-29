import { Dispatch } from 'react';
import { NextTableActions } from '@shared/modules/next-table/context/action-types';
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from '@shared/modules/next-table/context/actions';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { CashRegistersService } from '../services';

export const cashRegistersTableFetchUseCase = (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
    dispatch(nextTableFetchDataStartedAction());
    const result = await CashRegistersService.getList(tableQueryMaker(params));
    if (result.status === 200) {
        dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
    } else {
        dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
    }
};
