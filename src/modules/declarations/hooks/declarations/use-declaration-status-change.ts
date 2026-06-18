import { useCallback, useContext, useMemo } from 'react';
import { Modal, message } from 'antd';
import { useQuery } from 'react-query';

import { useBackgroundNavigate } from '@shared/hooks';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { DeclarationsService } from '../../services';
import { DeclarationsTableContext } from '../../context';

// Model-2 declaration state id meaning "stuck at customs" — changing to it
// always requires a reason, captured via the stuck-at-customs modal.
const STUCK_AT_CUSTOMS_STATUS_ID = 88;

/**
 * Declaration status change — both flavours:
 *  - `updateStatus(ids, statusId)` — explicit ids (row action or selected rows)
 *    → POST /api/admin/declaration/edit/state
 *  - `bulkUpdateStatus(statusId)` — every declaration matching the current filters
 *    → POST /api/admin/v2/declaration/edit/state
 *
 * `freelyStatuses` are the model-2 statuses flagged `freely`, used to populate the
 * bulk / selected dropdowns.
 */
export const useDeclarationStatusChange = () => {
  const { state, handleFetch, handleResetSelection } = useContext(DeclarationsTableContext);
  const navigate = useBackgroundNavigate();

  const statuses = useQuery(
    ['declarations', 'statuses'],
    async () => {
      const result = await DeclarationsService.getStatuses();
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const freelyStatuses = useMemo(() => (statuses.data || []).filter((s) => s.freely), [statuses.data]);

  const selectedIds = useMemo(
    () =>
      Object.entries(state.selectedRowIds)
        .filter(([, selected]) => selected)
        .map(([id]) => id),
    [state.selectedRowIds],
  );

  const updateStatus = useCallback(
    (ids: (string | number)[], statusId: string | number, description?: string) => {
      if (!ids.length) {
        message.warning('Heç bir bağlama seçilməyib.');
        return;
      }
      if (statusId === STUCK_AT_CUSTOMS_STATUS_ID && description === undefined) {
        navigate(`/declarations/${ids.join(',')}/stuck-at-customs`, { withBackground: true });
        return;
      }
      Modal.confirm({
        title: 'Diqqət',
        content: 'Status dəyişməyə əminsinizmi?',
        okText: 'Bəli',
        cancelText: 'Xeyr',
        onOk: async () => {
          const result = await DeclarationsService.updateStatus(ids, statusId, description);
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
    [handleFetch, handleResetSelection, navigate],
  );

  const updateSelectedStatus = useCallback((statusId: string | number) => updateStatus(selectedIds, statusId), [selectedIds, updateStatus]);

  const bulkUpdateStatus = useCallback(
    (statusId: string | number, description?: string) => {
      const query = tableQueryMaker({
        filters: state.filters,
        sortBy: state.sortBy,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
      });

      if (statusId === STUCK_AT_CUSTOMS_STATUS_ID && description === undefined) {
        navigate('/declarations/stuck-at-customs', { withBackground: true, state: { bulkUpdateDeclarationsStatus: { query } } });
        return;
      }

      Modal.confirm({
        title: 'Diqqət',
        content: `${state.total} ədəd bağlama seçilib. Toplu status dəyişməyə əminsinizmi?`,
        okText: 'Bəli',
        cancelText: 'Xeyr',
        onOk: async () => {
          const result = await DeclarationsService.bulkUpdateStatus(query, statusId, description);
          if (result.status === 200) {
            message.success('Statuslar dəyişdirildi');
            handleFetch();
          } else {
            message.error(result.data as string);
          }
        },
      });
    },
    [state.filters, state.sortBy, state.pageIndex, state.pageSize, state.total, handleFetch, navigate],
  );

  return {
    freelyStatuses,
    statusesLoading: statuses.isLoading,
    selectedIds,
    updateStatus,
    updateSelectedStatus,
    bulkUpdateStatus,
  };
};
