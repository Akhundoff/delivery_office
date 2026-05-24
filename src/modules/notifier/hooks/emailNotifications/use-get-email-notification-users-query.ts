import { useQuery } from "react-query";
import { ISendBulkEmailNotificationDto } from "../../interfaces";
import { BulkEmailNotificationService } from "../../services";

export const useGetEmailNotificationUsersQuery = (
  query: ISendBulkEmailNotificationDto,
) => {
  return useQuery(
    ["notifier", "email", "users", query],
    async () => {
      const result = await BulkEmailNotificationService.getUsers(query);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!query.type },
  );
};
