import { useCallback, useContext, useEffect } from "react";
import { useDeclarationsTableColumns } from "./use-declarations-table-columns";
import { DeclarationsService } from "../../services";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useBackgroundNavigate, useSearchParams } from "@shared/hooks";
import { DeclarationsTableContext } from "../../context";

export const useDeclarationsTable = () => {
  const columns = useDeclarationsTableColumns();
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(DeclarationsTableContext);
  const { searchParams, remove } = useSearchParams<{ reFetchDeclarationsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchDeclarationsTable) {
        remove.current('reFetchDeclarationsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchDeclarationsTable]);

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await DeclarationsService.getDeclarations(
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

  const getRowProps = useCallback(
    (id: any) => ({
      onDoubleClick: () =>
        navigate(`/declarations/${id}`, { withBackground: false }),
      style: { cursor: "pointer" },
    }),
    [navigate],
  );

  return { columns, onFetch, getRowProps };
};
