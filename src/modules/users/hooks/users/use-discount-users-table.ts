import { useCallback } from "react";
import { useUsersTableColumns } from "./use-users-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";

export const useDiscountUsersTable = () => {
  const columns = useUsersTableColumns();
  const navigate = useBackgroundNavigate();

  const getRowProps = useCallback(
    (id: any) => ({
      onDoubleClick: () => navigate(`/users/${id}`, { withBackground: false }),
      style: { cursor: "pointer" },
    }),
    [navigate],
  );

  return { columns, getRowProps };
};
