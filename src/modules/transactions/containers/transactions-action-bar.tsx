import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Descriptions, Dropdown, MenuProps, Popover, Space, Spin, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatusesService } from '@modules/statuses/services';
import { TransactionsTableContext } from '../context';
import { TransactionsService } from '../services';

export const TransactionsActionBar = () => {
  const backgroundNavigate = useBackgroundNavigate();
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(TransactionsTableContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;
  const selectedIds = Object.keys(state.selectedRowIds).map(Number);

  const [statsVisible, setStatsVisible] = useState(false);

  const { data: statusesResult } = useQuery(['statuses-for-transactions-bar', 4], () => StatusesService.getList({ per_page: 500, model_id: 4 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const isUserFiltered = useMemo(() => state.filters.some((f: any) => f.id === 'user_id'), [state.filters]);

  const { data: statsResult, isFetching: statsFetching } = useQuery(
    ['transactions-stats', state.filters],
    () => {
      const query: Record<string, any> = {};
      state.filters.forEach((f: any) => { query[f.id] = f.value; });
      return TransactionsService.getStats(query);
    },
    { enabled: isUserFiltered && statsVisible },
  );

  const statsData = statsResult?.status === 200 ? statsResult.data : null;

  const statsContent = useMemo(() => {
    if (!isUserFiltered) return 'İstifadəçi kodu daxil edilməyib';
    if (statsFetching) return <Spin />;
    if (!statsData) return null;
    return (
      <Descriptions size='small' bordered column={1}>
        <Descriptions.Item label='USD mədaxil'>{statsData.usd.in.toFixed(2)} $</Descriptions.Item>
        <Descriptions.Item label='USD məxaric'>{statsData.usd.out.toFixed(2)} $</Descriptions.Item>
        <Descriptions.Item label='USD balans'>{statsData.usd.difference.toFixed(2)} $</Descriptions.Item>
        <Descriptions.Item label='TRY mədaxil'>{statsData.try.in.toFixed(2)} ₺</Descriptions.Item>
        <Descriptions.Item label='TRY məxaric'>{statsData.try.out.toFixed(2)} ₺</Descriptions.Item>
        <Descriptions.Item label='TRY balans'>{statsData.try.difference.toFixed(2)} ₺</Descriptions.Item>
      </Descriptions>
    );
  }, [isUserFiltered, statsFetching, statsData]);

  const statusItems: MenuProps['items'] = statuses.map((s) => ({
    key: `bulk-status-${s.id}`,
    label: s.name,
    onClick: async () => {
      const result = await TransactionsService.changeStatus(selectedIds, s.id);
      if (result.status === 200) { message.success('Status dəyişdirildi.'); handleFetch(); }
      else message.error(result.data as string);
    },
  }));

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'tx-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const query: Record<string, any> = {};
    state.filters.forEach((f: any) => { query[f.id] = f.value; });
    const result = await TransactionsService.getExcel(query);
    if (result.status === 200) {
      message.success({ key: 'tx-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `transactions_export.xls`;
      a.click();
    } else {
      message.error({ key: 'tx-export', content: result.data as string });
    }
  }, [state.filters]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type='text' onClick={() => backgroundNavigate('/transactions/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Balans əməliyyatı
          </StyledHeaderButton>
          {!selectionCount ? (
            <StyledHeaderButton type='text' onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledActionBar.Selection>
              <Icons.CloseCircleTwoTone twoToneColor='#ff4d4f' onClick={handleResetSelection} style={{ cursor: 'pointer', fontSize: 16 }} role='icon' />
              <span>{selectionCount} seçilib</span>
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
          <Popover placement='bottom' onOpenChange={setStatsVisible} content={statsContent}>
            <StyledHeaderButton type='text' icon={<Icons.InfoCircleOutlined />} />
          </Popover>
          {!!selectionCount && (
            <Dropdown menu={{ items: statusItems }} trigger={['click']}>
              <StyledHeaderButton type='text' icon={<Icons.AppstoreOutlined />}>Statusu dəyiş</StyledHeaderButton>
            </Dropdown>
          )}
          <StyledHeaderButton type='text' onClick={exportAsExcel} icon={<Icons.FileExcelOutlined />}>
            Excel export
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
