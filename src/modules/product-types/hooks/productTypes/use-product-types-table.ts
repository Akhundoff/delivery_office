import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";

import { ProductTypesService } from "../../services";
import { useProductTypesTableColumns } from "./use-product-types-table-columns";
import { ProductTypesTableContext } from "../../context";

export const useProductTypesTable = () => {
  const columns = useProductTypesTableColumns();
  const { handleFetch } = useContext(ProductTypesTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchProductTypesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchProductTypesTable) {
        remove.current('reFetchProductTypesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchProductTypesTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await ProductTypesService.getList(tableQueryMaker(params));
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
