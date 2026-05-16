import { useCallback } from "react";
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { BoxesService } from "../../services";
import { useBoxesTableColumns } from "./use-boxes-table-columns";

export const useBoxesTable = () => {
  const columns = useBoxesTableColumns();
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
