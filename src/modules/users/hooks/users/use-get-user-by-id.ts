import { useQuery } from "react-query";
import { UsersService } from "../../services";

export const useGetUserById = (id: string | number | undefined) => {
  return useQuery(
    ["users", id],
    async () => {
      const result = await UsersService.getUserById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );
};
