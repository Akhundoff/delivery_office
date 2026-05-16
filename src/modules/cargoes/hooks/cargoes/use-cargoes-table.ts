import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";
import { CargoesService } from "../../services";
import { useCargoesTableColumns } from "./use-cargoes-table-columns";
import { CargoesTableContext } from "../../context";

export const useCargoesTable = () => {
  const columns = useCargoesTableColumns();
  const { handleFetch } = useContext(CargoesTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchCargoesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchCargoesTable) {
        remove.current('reFetchCargoesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchCargoesTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await CargoesService.getList(tableQueryMaker(params));
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
