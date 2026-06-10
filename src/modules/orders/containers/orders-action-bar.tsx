import React, { useCallback, useContext, useMemo } from 'react';
import { Dropdown, MenuProps, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';
import { CSVLink } from 'react-csv';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate, useMassiveExport } from '@shared/hooks';
import { tableFilterQueryMaker } from '@shared/modules/next-table/utils';
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

  const { handleExport, exportedData } = useMassiveExport(OrdersService.getList);

  const selectedItems = useMemo(() => state.data.filter((item) => selectedIds.includes(Number(item.id))), [selectedIds, state.data]);

  const totalPrice = useMemo(
    () =>
      selectedItems.reduce(
        (acc: number, item: any) => acc + item.product.price * item.product.quantity + item.product.internalShippingPrice + item.debts.internalShippingPrice,
        0,
      ),
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

  const statusItems: MenuProps['items'] = statuses.map((s) => ({
    key: `bulk-status-${s.id}`,
    label: s.name,
    onClick: async () => {
      if (Number(s.id) === REJECTED_STATUS_ID) {
        navigate('/orders/bulk_reject', { withBackground: true, state: { rejectIds: selectedIds } });
        return;
      }
      const result = await OrdersService.changeStatus(selectedIds, s.id);
      if (result.status === 200) { message.success('Status dəyişdirildi.'); handleFetch(); handleResetSelection(); }
      else message.error(result.data as string);
    },
  }));

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'orders-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await OrdersService.getExcel(tableFilterQueryMaker(state.filters));
    if (result.status === 200) {
      message.success({ key: 'orders-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = 'orders_export.xls';
      a.click();
    } else {
      message.error({ key: 'orders-export', content: result.data as string });
    }
  }, [state.filters]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {!selectionCount ? (
            <StyledHeaderButton type='text' onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledActionBar.Selection>
              <Icons.CloseCircleTwoTone twoToneColor='#ff4d4f' onClick={handleResetSelection} style={{ cursor: 'pointer', fontSize: 16 }} role='icon' />
              <span>
                {selectionCount} seçilib ({totalPrice.toFixed(2)} {CurrencySymbols.TRY})
              </span>
            </StyledActionBar.Selection>
          )}
          <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          <StyledHeaderButton type='text' disabled>Cəmi: {state.total}</StyledHeaderButton>
        </Space>
        <Space>
          {!!selectionCount && (
            <Dropdown menu={{ items: statusItems }} trigger={['click']}>
              <StyledHeaderButton type='text' icon={<Icons.AppstoreOutlined />}>Statusu dəyiş</StyledHeaderButton>
            </Dropdown>
          )}
          <StyledHeaderButton type='text' onClick={openCountsByStatus} icon={<Icons.BarChartOutlined />}>
            Statuslar üzrə say
          </StyledHeaderButton>
          {exportedData.length ? (
            <StyledHeaderButton type='text' icon={<Icons.FileExcelOutlined />}>
              <CSVLink style={{ marginLeft: 8 }} filename={`orders_list_${Math.round(Math.random() * 1000)}.csv`} data={exportedData as any[]}>
                Yüklə
              </CSVLink>
            </StyledHeaderButton>
          ) : (
            <StyledHeaderButton type='text' onClick={handleMassiveExport} icon={<Icons.FileExcelOutlined />}>
              CSV export
            </StyledHeaderButton>
          )}
          <StyledHeaderButton type='text' onClick={exportAsExcel} icon={<Icons.FileExcelOutlined />}>
            Excel export
          </StyledHeaderButton>
          <StyledHeaderButton type='text' onClick={openCreate} icon={<Icons.PlusOutlined />}>
            Yeni sifariş
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
