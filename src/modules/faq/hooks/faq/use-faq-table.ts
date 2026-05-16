import { useCallback, useContext, useEffect } from "react";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useSearchParams } from "@shared/hooks";
import { FaqService } from "../../services";
import { useFaqTableColumns } from "./use-faq-table-columns";
import { FaqTableContext } from "../../context";

export const useFaqTable = () => {
  const columns = useFaqTableColumns();
  const { handleFetch } = useContext(FaqTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchFaqTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchFaqTable) {
        remove.current('reFetchFaqTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchFaqTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await FaqService.getList(tableQueryMaker(params));
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
