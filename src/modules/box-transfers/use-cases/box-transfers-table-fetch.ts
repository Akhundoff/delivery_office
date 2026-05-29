import { Dispatch } from 'react';
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from '@shared/modules/next-table/context/actions';
import { NextTableActions } from '@shared/modules/next-table/context/action-types';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { BoxTransfersService } from '../services';
import { BoxTransfersRequestType } from '../interfaces';

const filterKeyMap: Record<BoxTransfersRequestType, string> = {
    branch: 'branch_id',
    declaration: 'declaration_id',
    container: 'container_id',
};

export const boxTransfersTableFetchUseCase = (id?: string, type: BoxTransfersRequestType = 'branch') => (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
    dispatch(nextTableFetchDataStartedAction());
    const query: Record<string, any> = { ...tableQueryMaker(params) };
    if (id) query[filterKeyMap[type]] = id;
    const result = await BoxTransfersService.getList(query, type);
    if (result.status === 200) {
        dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
    } else {
        dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
    }
};
