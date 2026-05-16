import { useCallback } from 'react';
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from '@shared/modules/next-table/context/actions';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { CustomsDeclarationsService } from '../../services';
import { useCustomsDeclarationsTableColumns } from './use-customs-declarations-table-columns';

export const useCustomsDeclarationsTable = () => {
    const columns = useCustomsDeclarationsTableColumns();

    const onFetch = useCallback(
        (params: NextTableFetchParams) => async (dispatch: any) => {
            dispatch(nextTableFetchDataStartedAction());
            const result = await CustomsDeclarationsService.getList(tableQueryMaker(params));
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
