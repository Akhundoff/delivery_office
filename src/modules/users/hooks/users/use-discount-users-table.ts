import { useCallback } from "react";
import { useUsersTableColumns } from "./use-users-table-columns";
import { UsersService } from "../../services";
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from "@shared/modules/next-table/context/actions";
import { NextTableFetchParams } from "@shared/modules/next-table/types";
import { tableQueryMaker } from "@shared/modules/next-table/utils";
import { useBackgroundNavigate } from "@shared/hooks";

export const useDiscountUsersTable = () => {
  const columns = useUsersTableColumns();
  const navigate = useBackgroundNavigate();

  const onFetch = useCallback(
    (params: NextTableFetchParams) => async (dispatch: any) => {
      dispatch(nextTableFetchDataStartedAction());
      const result = await UsersService.getDiscountUsers(
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
      onDoubleClick: () => navigate(`/users/${id}`, { withBackground: false }),
      style: { cursor: "pointer" },
    }),
    [navigate],
  );

  return { columns, onFetch, getRowProps };
};
