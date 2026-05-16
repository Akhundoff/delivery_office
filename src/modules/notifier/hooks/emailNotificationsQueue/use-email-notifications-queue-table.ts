import { useCallback } from 'react';
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from '@shared/modules/next-table/context/actions';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils/query-maker';
import { EmailNotificationsQueueService } from '../../services';

export const useEmailNotificationsQueueTable = () => {
    const onFetch = useCallback(
        (params: NextTableFetchParams) => async (dispatch: any) => {
            dispatch(nextTableFetchDataStartedAction());
            const result = await EmailNotificationsQueueService.getList(tableQueryMaker(params));
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
