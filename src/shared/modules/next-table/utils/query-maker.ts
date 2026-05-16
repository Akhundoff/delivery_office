import { NextTableFetchParams } from "../types";

export type TableFilter = { id: string | number; value: any };

export const tableQueryMaker = (params: NextTableFetchParams) => {
  const filters = params.filters.reduce<Record<string, any>>(
    (acc, { id, value }) => ({ ...acc, [id]: value }),
    {},
  );
  const sort = params.sortBy.reduce<Record<string, any>>(
    (acc, { id, desc }) => ({
      ...acc,
      sort_column: id,
      sort_order: desc ? "desc" : "asc",
    }),
    {},
  );
  const page = params.pageIndex + 1;

  return { ...filters, ...sort, page, per_page: params.pageSize };
};

export const tableFilterQueryMaker = (filters: TableFilter[]) => {
  return filters.reduce<Record<string, any>>(
    (acc, { id, value }) => ({ ...acc, [id]: value }),
    {},
  );
};
