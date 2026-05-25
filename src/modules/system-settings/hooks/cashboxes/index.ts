import { useQuery } from "react-query";
import { ApiResult, caller, urlMaker } from "@shared/utils";

type ICashbox = { id: number; name: string };

const getCashboxes = async (): Promise<ApiResult<200, ICashbox[]> | ApiResult<400, string>> => {
  const url = urlMaker("/api/admin/cashboxes", { per_page: 1000 });
  try {
    const response = await caller(url);
    if (response.ok) {
      const result = await response.json();
      const items: ICashbox[] = (result.data || []).map((item: any) => ({ id: item.id, name: item.cashbox_name }));
      return new ApiResult(200, items, null);
    }
    return new ApiResult(400, "Kassalar əldə edilə bilmədi", null);
  } catch {
    return new ApiResult(400, "Şəbəkə xətası.", null);
  }
};

export const useCashboxes = () =>
  useQuery(
    ["cashboxes"],
    async () => {
      const result = await getCashboxes();
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );
