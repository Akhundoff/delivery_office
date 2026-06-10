import { useCallback, useContext, useMemo, useState } from 'react';
import { Modal, message } from 'antd';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { UnitedDeclarationsService } from '../../services';
import { UnitedDeclarationsTableContext } from '../../context';
import { useStatuses } from '@modules/statuses/hooks';
import { IDeclaration } from '@modules/declarations/interfaces';

export const useUnitedDeclarationsActionBar = () => {
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(UnitedDeclarationsTableContext);
  const [exportedData, setExportedData] = useState<IDeclaration[]>([]);

  const statusesQuery = useStatuses({ model_id: 2, per_page: 500 });
  const trendyolStatusesQuery = useStatuses({ model_id: 43, per_page: 500 });

  const freelyTrueStatuses = useMemo(() => (statusesQuery.data || []).filter((s) => s.freely), [statusesQuery.data]);
  const trendyolStatuses = trendyolStatusesQuery.data || [];

  const selectedIds = useMemo(
    () =>
      Object.entries(state.selectedRowIds)
        .filter(([, v]) => v)
        .map(([k]) => k),
    [state.selectedRowIds],
  );

  const { totalPrice, totalWeight } = useMemo(() => {
    const selected = (state.data || []).filter((r: any) => state.selectedRowIds[r.id]);
    const totalPrice = { usd: 0, azn: 0 };
    let totalWeight = 0;
    selected.forEach((r: any) => {
      totalWeight += r.weight || 0;
      totalPrice.usd += r.price || 0;
    });
    return { totalPrice, totalWeight };
  }, [state.data, state.selectedRowIds]);

  const buildQuery = useCallback(
    () =>
      tableQueryMaker({
        filters: state.filters,
        sortBy: state.sortBy,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
      }),
    [state.filters, state.sortBy, state.pageIndex, state.pageSize],
  );

  const updateStatus = useCallback(
    (statusId: string | number) => {
      if (!selectedIds.length) return message.warning('Heç bir bağlama seçilməyib');
      Modal.confirm({
        title: 'Diqqət',
        content: 'Status dəyişməyə əminsinizmi?',
        okText: 'Bəli',
        cancelText: 'Xeyr',
        onOk: async () => {
          const result = await UnitedDeclarationsService.updateStatus(selectedIds, statusId);
          if (result.status === 200) {
            message.success('Status dəyişdirildi');
            handleResetSelection();
            handleFetch();
          } else {
            message.error(result.data as string);
          }
        },
      });
    },
    [selectedIds, handleFetch, handleResetSelection],
  );

  const bulkUpdateStatus = useCallback(
    (statusId: string | number) => {
      Modal.confirm({
        title: 'Diqqət',
        content: `${state.total} ədəd bağlama seçilib. Toplu status dəyişməyə əminsinizmi?`,
        okText: 'Bəli',
        cancelText: 'Xeyr',
        onOk: async () => {
          const result = await UnitedDeclarationsService.bulkUpdateStatus(buildQuery(), statusId);
          if (result.status === 200) {
            message.success('Statuslar dəyişdirildi');
            handleFetch();
          } else {
            message.error(result.data as string);
          }
        },
      });
    },
    [buildQuery, state.total, handleFetch],
  );

  const changeTrendyolStatus = useCallback(
    (statusId: string | number) => {
      if (!selectedIds.length) return;
      Modal.confirm({
        title: 'Diqqət',
        content: 'Trendyol statusu dəyişilsin?',
        okText: 'Bəli',
        cancelText: 'Xeyr',
        onOk: async () => {
          const result = await UnitedDeclarationsService.changeTrendyolStatus(selectedIds, statusId);
          if (result.status === 200) {
            message.success('Trendyol statusu dəyişdirildi');
            handleResetSelection();
            handleFetch();
          } else {
            message.error(result.data as string);
          }
        },
      });
    },
    [selectedIds, handleFetch, handleResetSelection],
  );

  const bulkUpdateTrendyolStatus = useCallback(
    (statusId: string | number) => {
      Modal.confirm({
        title: 'Diqqət',
        content: 'Toplu Trendyol statusunu dəyişməyə əminsinizmi?',
        okText: 'Bəli',
        cancelText: 'Xeyr',
        onOk: async () => {
          const result = await UnitedDeclarationsService.bulkUpdateTrendyolStatus(buildQuery(), statusId);
          if (result.status === 200) {
            message.success('Statuslar dəyişdirildi');
            handleFetch();
          } else {
            message.error(result.data as string);
          }
        },
      });
    },
    [buildQuery, handleFetch],
  );

  const handleExport = useCallback(async (query: Record<string, any>) => {
    const result = await UnitedDeclarationsService.getExport(query);
    if (result.status === 200) {
      setExportedData(result.data as IDeclaration[]);
    } else {
      message.error('Export uğursuz oldu');
    }
  }, []);

  return {
    totalPrice,
    totalWeight,
    fetch: handleFetch,
    reset: handleReset,
    selectAll: handleSelectAll,
    resetSelection: handleResetSelection,
    selection: selectedIds,
    state,
    freelyTrueStatuses,
    trendyolStatuses,
    updateStatus,
    bulkUpdateStatus,
    changeTrendyolStatus,
    bulkUpdateTrendyolStatus,
    handleExport,
    exportedData,
    buildQuery,
  };
};
