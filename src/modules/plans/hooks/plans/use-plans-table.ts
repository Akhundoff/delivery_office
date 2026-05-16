import { useCallback, useContext, useEffect } from "react";
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";
import { PlansService } from "../../services";
import { usePlansTableColumns } from "./use-plans-table-columns";
import { PlansTableContext } from "../../context";

export const usePlansTable = () => {
  const columns = usePlansTableColumns();
  const { handleFetch } = useContext(PlansTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchPlansTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchPlansTable) {
        remove.current('reFetchPlansTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchPlansTable]);
  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await PlansService.getList(tableQueryMaker(params));
      if (result.status === 200) dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
      else dispatch(nextTableFetchDataFailedAction("Xəta baş verdi."));
    },
    [],
  );
  return { columns, onFetch };
};
