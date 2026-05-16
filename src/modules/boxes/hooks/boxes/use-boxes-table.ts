import { useCallback, useContext, useEffect } from "react";
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";
import { BoxesService } from "../../services";
import { useBoxesTableColumns } from "./use-boxes-table-columns";
import { BoxesTableContext } from "../../context";

export const useBoxesTable = () => {
  const columns = useBoxesTableColumns();
  const { handleFetch } = useContext(BoxesTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchBoxesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchBoxesTable) {
        remove.current('reFetchBoxesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchBoxesTable]);
  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await BoxesService.getList(tableQueryMaker(params));
      if (result.status === 200) dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
      else dispatch(nextTableFetchDataFailedAction("Xəta baş verdi."));
    },
    [],
  );
  return { columns, onFetch };
};
