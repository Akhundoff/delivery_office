import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";

import { ReturnTypesService } from "../../services";
import { useReturnTypesTableColumns } from "./use-return-types-table-columns";
import { ReturnTypesTableContext } from "../../context";

export const useReturnTypesTable = () => {
  const columns = useReturnTypesTableColumns();
  const { handleFetch } = useContext(ReturnTypesTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchReturnTypesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchReturnTypesTable) {
        remove.current('reFetchReturnTypesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchReturnTypesTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await ReturnTypesService.getList(
        tableQueryMaker(params),
      );
      if (result.status === 200) {
        dispatch(
          nextTableFetchDataSucceedAction({
            data: result.data.data,
            total: result.data.total,
          }),
        );
      } else {
        dispatch(nextTableFetchDataFailedAction("Xəta baş verdi."));
      }
    },
    [],
  );

  return { columns, onFetch };
};
