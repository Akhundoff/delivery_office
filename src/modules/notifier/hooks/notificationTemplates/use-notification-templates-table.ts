import { useCallback } from 'react';
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from '@shared/modules/next-table/context/actions';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { NotificationTemplatesService } from '../../services';
import { useNotificationTemplatesTableColumns } from './use-notification-templates-table-columns';

export const useNotificationTemplatesTable = () => {
    const columns = useNotificationTemplatesTableColumns();

    const onFetch = useCallback(
        (params: NextTableFetchParams) => async (dispatch: any) => {
            dispatch(nextTableFetchDataStartedAction());
            const result = await NotificationTemplatesService.getList(tableQueryMaker(params));
            if (result.status === 200) {
                dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
            } else {
                dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
            }
        },
        [],
    );

    return { columns, onFetch };
};
