import { useCallback, useContext, useEffect } from "react";
import { nextTableFetchDataFailedAction, nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction } from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";
import { ShopNamesService } from "../../services";
import { useShopNamesTableColumns } from "./use-shop-names-table-columns";
import { ShopNamesTableContext } from "../../context";

export const useShopNamesTable = () => {
  const columns = useShopNamesTableColumns();
  const { handleFetch } = useContext(ShopNamesTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchShopNamesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchShopNamesTable) {
        remove.current('reFetchShopNamesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchShopNamesTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await ShopNamesService.getList(tableQueryMaker(params));
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
