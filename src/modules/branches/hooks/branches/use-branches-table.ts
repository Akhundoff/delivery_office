import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";

import { BranchesService } from "../../services";
import { useBranchesTableColumns } from "./use-branches-table-columns";
import { BranchesTableContext } from "../../context";

export const useBranchesTable = () => {
  const columns = useBranchesTableColumns();
  const { handleFetch } = useContext(BranchesTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchBranchesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchBranchesTable) {
        remove.current('reFetchBranchesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchBranchesTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await BranchesService.getList(tableQueryMaker(params));
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
