import { useCallback, useContext } from "react";
import { useUsersTableColumns } from "./use-users-table-columns";
import { DiscountUsersTableContext } from "../../context";
import { useBackgroundNavigate } from "@shared/hooks";

export const useDiscountUsersTable = () => {
  const { handleFetch } = useContext(DiscountUsersTableContext);
  const columns = useUsersTableColumns(handleFetch);
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
