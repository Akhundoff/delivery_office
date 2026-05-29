import { Dispatch } from 'react';
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from '@shared/modules/next-table/context/actions';
import { NextTableActions } from '@shared/modules/next-table/context/action-types';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { SortingService } from '../services';
import { SortingDeclarationsView } from '../interfaces';

export const sortingsTableFetchUseCase = (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
  dispatch(nextTableFetchDataStartedAction());
  const result = await SortingService.getList(tableQueryMaker(params));
  if (result.status === 200) dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
  else dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
};

export const nonSortedDeclarationsTableFetchUseCase = (flightId?: string) => (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
  dispatch(nextTableFetchDataStartedAction());
  const result = await SortingService.getNonSortedDeclarations({ ...tableQueryMaker(params), flight_id: flightId });
  if (result.status === 200) dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
  else dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
};

export const sortingDeclarationsTableFetchUseCase = (parcelSortingId: string, view: SortingDeclarationsView) => (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
  dispatch(nextTableFetchDataStartedAction());
  const query = { ...tableQueryMaker(params), parcel_sorting_id: parcelSortingId };
  const fetcher =
    view === 'another' ? SortingService.getAnotherDeclarations : view === 'missing' ? SortingService.getMissingDeclarations : SortingService.getDeclarations;
  const result = await fetcher(query);
  if (result.status === 200) dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
  else dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
};
