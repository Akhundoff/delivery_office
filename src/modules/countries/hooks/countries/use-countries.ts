import { useQuery } from "react-query";
import { CountriesService } from "../../services";

export type ICountryOption = { id: number; name: string };

export const useCountries = () => {
  return useQuery<ICountryOption[], Error>(
    ["countries-select"],
    async () => {
      const result = await CountriesService.getList({ per_page: 1000 });
      if (result.status === 200) return result.data.data.map((c) => ({ id: c.id, name: c.name }));
      throw new Error("Ölkələr yüklənmədi");
    },
    { staleTime: 5 * 60 * 1000 },
  );
};
