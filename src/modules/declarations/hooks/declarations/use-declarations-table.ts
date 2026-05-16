import { useCallback, useContext, useEffect } from "react";
import { useDeclarationsTableColumns } from "./use-declarations-table-columns";
import { useBackgroundNavigate, useSearchParams } from "@shared/hooks";
import { DeclarationsTableContext } from "../../context";

export const useDeclarationsTable = () => {
  const { handleFetch } = useContext(DeclarationsTableContext);
  const columns = useDeclarationsTableColumns();
  const navigate = useBackgroundNavigate();
  const { searchParams, remove } = useSearchParams<{ reFetchDeclarationsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchDeclarationsTable) {
        remove.current('reFetchDeclarationsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchDeclarationsTable]);

  const getRowProps = useCallback(
    (id: any) => ({
      onDoubleClick: () =>
        navigate(`/declarations/${id}`, { withBackground: false }),
      style: { cursor: "pointer" },
    }),
    [navigate],
  );

  return { columns, getRowProps };
};
