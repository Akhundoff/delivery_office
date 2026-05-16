import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";
import { NewsService } from "../../services";
import { useNewsTableColumns } from "./use-news-table-columns";
import { NewsTableContext } from "../../context";

export const useNewsTable = () => {
  const columns = useNewsTableColumns();
  const { handleFetch } = useContext(NewsTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchNewsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchNewsTable) {
        remove.current('reFetchNewsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchNewsTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await NewsService.getList(tableQueryMaker(params));
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
