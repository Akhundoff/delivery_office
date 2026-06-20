import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import type { NextTableFetchParams } from '@shared/modules/next-table/types';
import { DeclarationsTableContext } from '@modules/declarations/context';
import { FlightsService } from '../../services';

export const useBoxDeclarationsTable = () => {
  const { id } = useParams<{ id: string }>();

  const onFetch = useCallback(async (params: NextTableFetchParams) => {
    const result = await FlightsService.getBoxDeclarations(tableQueryMaker(params));
    if (result.status === 200) return { data: result.data.data, total: result.data.total };
    throw new Error(result.data as string);
  }, []);

  const defaultState = useMemo(
    () => ({
      hiddenColumns: ['flight_name', 'edited_by_name', 'plan_category_name', 'wardrobe_number'],
      filters: [{ id: 'box_id', value: id }],
    }),
    [id],
  );

  return { onFetch, context: DeclarationsTableContext, defaultState };
};
