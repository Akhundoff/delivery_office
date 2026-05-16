import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";
import { PopupsService } from "../../services";
import { usePopupsTableColumns } from "./use-popups-table-columns";
import { PopupsTableContext } from "../../context";

export const usePopupsTable = () => {
  const columns = usePopupsTableColumns();
  const { handleFetch } = useContext(PopupsTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchPopupsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchPopupsTable) {
        remove.current('reFetchPopupsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchPopupsTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await PopupsService.getList(tableQueryMaker(params));
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
