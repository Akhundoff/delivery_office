import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";
import { BannersService } from "../../services";
import { useBannersTableColumns } from "./use-banners-table-columns";
import { BannersTableContext } from "../../context";

export const useBannersTable = () => {
  const columns = useBannersTableColumns();
  const { handleFetch } = useContext(BannersTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchBannersTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchBannersTable) {
        remove.current('reFetchBannersTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchBannersTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await BannersService.getList(tableQueryMaker(params));
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
