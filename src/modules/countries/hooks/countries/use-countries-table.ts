import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";

import { CountriesService } from "../../services";
import { useCountriesTableColumns } from "./use-countries-table-columns";
import { CountriesTableContext } from "../../context";

export const useCountriesTable = () => {
  const columns = useCountriesTableColumns();
  const { handleFetch } = useContext(CountriesTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchCountriesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchCountriesTable) {
        remove.current('reFetchCountriesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchCountriesTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await CountriesService.getList(tableQueryMaker(params));
      if (result.status === 200) {
        dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
      } else {
        dispatch(nextTableFetchDataFailedAction("Xəta baş verdi."));
      }
    },
    [],
  );

  return { columns, onFetch };
};
