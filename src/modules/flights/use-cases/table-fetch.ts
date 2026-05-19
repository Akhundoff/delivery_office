import { Dispatch } from 'react';
import { message } from 'antd';
import { nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction, nextTableFetchDataFailedAction } from '@shared/modules/next-table/context/actions';
import { NextTableActions } from '@shared/modules/next-table/context/action-types';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { FlightsService } from '../services';

export const flightsTableFetchUseCase = (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
  dispatch(nextTableFetchDataStartedAction());
  const result = await FlightsService.getList(tableQueryMaker(params));
  if (result.status === 200) {
    dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
  } else {
    dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
    message.error(result.data as string);
  }
};
