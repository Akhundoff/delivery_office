import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";

import { RegionsService } from "../../services";
import { useRegionsTableColumns } from "./use-regions-table-columns";
import { RegionsTableContext } from "../../context";

export const useRegionsTable = () => {
  const columns = useRegionsTableColumns();
  const { handleFetch } = useContext(RegionsTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchRegionsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchRegionsTable) {
        remove.current('reFetchRegionsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchRegionsTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await RegionsService.getList(tableQueryMaker(params));
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
