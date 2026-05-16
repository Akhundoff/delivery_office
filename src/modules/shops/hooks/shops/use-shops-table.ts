import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";
import { ShopsService } from "../../services";
import { useShopsTableColumns } from "./use-shops-table-columns";
import { ShopsTableContext } from "../../context";

export const useShopsTable = () => {
  const columns = useShopsTableColumns();
  const { handleFetch } = useContext(ShopsTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchShopsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchShopsTable) {
        remove.current('reFetchShopsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchShopsTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await ShopsService.getList(tableQueryMaker(params));
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
