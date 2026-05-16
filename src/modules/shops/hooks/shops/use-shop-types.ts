import { useQuery } from "react-query";
import { ShopsService } from "../../services";
import { IShopType } from "../../interfaces";

export const useShopTypes = () => {
  return useQuery<IShopType[], Error>(
    ["shop-types"],
    async () => {
      const result = await ShopsService.getCategories();
      if (result.status === 200) return result.data;
      throw new Error("Kateqoriyalar yüklənmədi");
    },
    { staleTime: 5 * 60 * 1000 },
  );
};
