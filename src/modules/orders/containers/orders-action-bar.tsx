import React, { useCallback, useContext, useMemo } from 'react';
import { Dropdown, MenuProps, Modal, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';
import { CSVLink } from 'react-csv';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate, useMassiveExport } from '@shared/hooks';
import { tableFilterQueryMaker, tableQueryMaker } from '@shared/modules/next-table/utils';
import { StatusesService } from '@modules/statuses/services';
import { OrdersTableContext } from '../context';
import { OrdersService } from '../services';
import { REJECTED_STATUS_ID, CurrencySymbols } from '../constants';

export const OrdersActionBar = () => {
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(OrdersTableContext);
  const navigate = useBackgroundNavigate();
  const selectionCount = Object.keys(state.selectedRowIds).length;
  const selectedIds = Object.keys(state.selectedRowIds).map(Number);

  const { data: statusesResult } = useQuery(['statuses-for-orders-bar', 1], () => StatusesService.getList({ per_page: 500, model_id: 1 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const { handleExport, exportedData } = useMassiveExport(OrdersService.getListForExport);

  const selectedItems = useMemo(() => state.data.filter((item) => selectedIds.includes(Number(item.id))), [selectedIds, state.data]);

  const totalPrice = useMemo(
    () => selectedItems.reduce((acc: number, item: any) => acc + item.product.price * item.product.quantity + item.product.internalShippingPrice + item.debts.internalShippingPrice, 0),
    [selectedItems],
  );

  const openCreate = useCallback(() => {
    navigate('/orders/create', { withBackground: true });
  }, [navigate]);

  const openCountsByStatus = useCallback(() => {
    navigate('/statistics/status/order-counts', { withBackground: true });
  }, [navigate]);

  const handleMassiveExport = useCallback(() => {
    handleExport(tableFilterQueryMaker(state.filters));
  }, [handleExport, state.filters]);

  const updateStatus = useCallback(
    async (statusId: string | number) => {
      if (Number(statusId) === REJECTED_STATUS_ID) {
        navigate(`/orders/${selectedIds.join('/')}/reject`, { withBackground: true, state: { rejectIds: selectedIds } });
        return;
      }
      message.loading({ content: 'Status dəyişdirilir...', duration: 0 });
      const result = await OrdersService.changeStatus(selectedIds, statusId);
      message.destroy();
      if (result.status === 200) {
        handleFetch();
      } else {
        message.error(result.data as string);
      }
    },
    [selectedIds, handleFetch, navigate],
  );

  const bulkUpdateStatus = useCallback(
    (statusId: string | number) => {
      if (Number(statusId) === REJECTED_STATUS_ID) {
        navigate('/orders/bulk_reject', { withBackground: true, state: { rejectQuery: tableFilterQueryMaker(state.filters) } });
        return;
      }
      Modal.confirm({
        title: 'Diqqət',
        content: 'Toplu status dəyişməyə əminsinizmi?',
        onOk: async () => {
          const query = tableQueryMaker({ filters: state.filters, sortBy: state.sortBy, pageIndex: state.pageIndex, pageSize: state.pageSize });
          const result = await OrdersService.bulkChangeStatus(query, statusId);
          if (result.status === 200) {
            handleFetch();
          } else {
            message.error(result.data as string);
          }
        },
      });
    },
    [state.filters, state.sortBy, state.pageIndex, state.pageSize, handleFetch, navigate],
  );

  const selectionStatusItems: MenuProps['items'] = statuses.map((s) => ({
    key: `sel-status-${s.id}`,
    label: s.name,
    onClick: () => updateStatus(s.id),
  }));

  const bulkStatusItems: MenuProps['items'] = statuses.map((s) => ({
    key: `bulk-status-${s.id}`,
    label: s.name,
    onClick: () => bulkUpdateStatus(s.id),
  }));

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'orders-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await OrdersService.getExcel(tableFilterQueryMaker(state.filters));
    if (result.status === 200) {
      message.success({ key: 'orders-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `declarations_export_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
    } else {
      message.error({ key: 'orders-export', content: result.data as string });
    }
  }, [state.filters]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={openCreate} icon={<Icons.PlusCircleOutlined />}>
            Yeni
          </StyledHeaderButton>
          {!selectionCount ? (
            <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledHeaderButton type="text" onClick={handleResetSelection} icon={<Icons.CloseCircleOutlined />}>
              {selectionCount} sətir ({totalPrice.toFixed(2)} {CurrencySymbols.TRY})
            </StyledHeaderButton>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          {exportedData.length ? (
            <StyledHeaderButton type="text" icon={<Icons.FileExcelOutlined />}>
              <CSVLink style={{ marginLeft: '0.5em' }} filename={`orders_list_${Math.round(Math.random() * 1000)}.csv`} data={exportedData as any[]}>
                Yüklə
              </CSVLink>
            </StyledHeaderButton>
          ) : (
            <StyledHeaderButton type="text" onClick={handleMassiveExport} icon={<Icons.FileExcelOutlined />}>
              Export
            </StyledHeaderButton>
          )}
        </Space>
        {!selectionCount ? (
          <Space>
            <StyledHeaderButton type="text" onClick={openCountsByStatus} icon={<Icons.BarChartOutlined />} />
            <StyledHeaderButton type="text" onClick={exportAsExcel} icon={<Icons.FileExcelOutlined />}>
              Export
            </StyledHeaderButton>
            <Dropdown menu={{ items: bulkStatusItems }} trigger={['click']}>
              <StyledHeaderButton type="text" icon={<Icons.AppstoreOutlined />}>
                Toplu status dəyiş
              </StyledHeaderButton>
            </Dropdown>
          </Space>
        ) : (
          <Space>
            <Dropdown menu={{ items: selectionStatusItems }} trigger={['click']}>
              <StyledHeaderButton type="text" icon={<Icons.AppstoreOutlined />}>
                Statusu dəyiş
              </StyledHeaderButton>
            </Dropdown>
          </Space>
        )}
      </StyledActionBar>
    </HeadPortal>
  );
};
