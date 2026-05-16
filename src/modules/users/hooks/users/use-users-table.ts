import { useCallback, useContext, useEffect } from "react";
import { useUsersTableColumns } from "./use-users-table-columns";
import { useBackgroundNavigate, useSearchParams } from "@shared/hooks";
import { UsersTableContext } from "../../context";

export const useUsersTable = () => {
  const { handleFetch } = useContext(UsersTableContext);
  const columns = useUsersTableColumns();
  const navigate = useBackgroundNavigate();
  const { searchParams, remove } = useSearchParams<{ reFetchUsersTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchUsersTable) {
        remove.current('reFetchUsersTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchUsersTable]);

  const getRowProps = useCallback(
    (id: any) => ({
      onDoubleClick: () => navigate(`/users/${id}`, { withBackground: false }),
      style: { cursor: "pointer" },
    }),
    [navigate],
  );

  return { columns, getRowProps };
};
