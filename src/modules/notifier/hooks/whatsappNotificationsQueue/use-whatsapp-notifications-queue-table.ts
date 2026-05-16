import { useCallback } from 'react';
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from '@shared/modules/next-table/context/actions';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils/query-maker';
import { WhatsappNotificationsQueueService } from '../../services';

export const useWhatsappNotificationsQueueTable = () => {
    const onFetch = useCallback(
        (params: NextTableFetchParams) => async (dispatch: any) => {
            dispatch(nextTableFetchDataStartedAction());
            const result = await WhatsappNotificationsQueueService.getList(tableQueryMaker(params));
            if (result.status === 200) {
                dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
            } else {
                dispatch(nextTableFetchDataFailedAction());
            }
        },
        [],
    );

    return { onFetch };
};
