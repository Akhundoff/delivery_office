import { message } from "antd";
import { useState, useCallback } from "react";
import { ApiResult } from "@shared/utils";

type PagedResult<T> =
  | ApiResult<200, { data: T[]; total: number }>
  | ApiResult<400, string>;
type PagedFetcher<T> = (query: Record<string, any>) => Promise<PagedResult<T>>;

const PER_PAGE = 500;

export const useMassiveExport = <T>(fetcher: PagedFetcher<T>) => {
  const [exportedData, setExportedData] = useState<T[]>([]);

  const handleExport = useCallback(
    async (query: Record<string, any> = {}) => {
      setExportedData([]);
      message.loading({
        key: "massive-export",
        content: "Sənəd hazırlanır...",
        duration: 0,
      });

      try {
        const initial = await fetcher({
          ...query,
          page: 1,
          per_page: PER_PAGE,
        });

        if (initial.status !== 200) {
          message.error({ key: "massive-export", content: "Xəta baş verdi." });
          return [];
        }

        const { data: firstPageData, total } = (
          initial as ApiResult<200, { data: T[]; total: number }>
        ).data;
        const totalPages = Math.ceil(total / PER_PAGE);

        const fetchPage = async (page: number): Promise<T[]> => {
          const result = await fetcher({ ...query, page, per_page: PER_PAGE });
          return result.status === 200
            ? (result as ApiResult<200, { data: T[]; total: number }>).data.data
            : [];
        };

        const remainingPromises = Array.from(
          { length: totalPages - 1 },
          (_, i) => fetchPage(i + 2),
        );
        const results = await Promise.allSettled(remainingPromises);
        const allData = [
          ...firstPageData,
          ...results.flatMap((r) => (r.status === "fulfilled" ? r.value : [])),
        ];

        message.success({
          key: "massive-export",
          content: "Sənəd hazırdır. Yüklə butonuna klikləyin",
        });
        setExportedData(allData);
        return allData;
      } catch {
        message.error({ key: "massive-export", content: "Şəbəkə xətası." });
        return [];
      }
    },
    [fetcher],
  );

  return { handleExport, exportedData };
};
