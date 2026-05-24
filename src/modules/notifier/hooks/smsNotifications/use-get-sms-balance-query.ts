import { useQuery } from "react-query";
import { SmsBalanceService } from "../../services";

export const useGetSmsBalanceQuery = () => {
  return useQuery(["notifier", "sms", "balance"], async () => {
    const result = await SmsBalanceService.getBalance();
    if (result.status === 200) return result.data;
    throw new Error(result.data as string);
  });
};
