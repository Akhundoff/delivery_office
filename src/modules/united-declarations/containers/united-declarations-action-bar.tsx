import React, { useContext, useCallback } from 'react';
import * as Icons from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { MeContext } from '@modules/me/context/context';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { useUnitedDeclarationsActionBar } from '../hooks';

export const UnitedDeclarationsActionBar = () => {
  const { can } = useContext(MeContext);
  const { totalPrice, totalWeight, fetch, reset, selectAll, resetSelection, selection, state, freelyTrueStatuses, trendyolStatuses, updateStatus, bulkUpdateStatus, changeTrendyolStatus, bulkUpdateTrendyolStatus, handleExport, exportedData } =
    useUnitedDeclarationsActionBar();

  const hasFilters = state.filters.length > 0;

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

  const handleDownloadCsv = useCallback(() => {
    const headers = Object.keys(exportedData[0] || {}).join(',');
    const rows = exportedData.map((row: any) =>
      Object.values(row)
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(','),
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `trendyol_declarations_${Math.round(Math.random() * 1000)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [exportedData]);

  const bulkStatusMenuItems: MenuProps['items'] = freelyTrueStatuses.map((status) => ({
    key: status.id,
    label: status.name,
    onClick: () => bulkUpdateStatus(status.id),
  }));

  const bulkTrendyolMenuItems: MenuProps['items'] = trendyolStatuses.map((status) => ({
    key: status.id,
    label: status.name,
    onClick: () => bulkUpdateTrendyolStatus(status.id),
  }));

  const selectedStatusMenuItems: MenuProps['items'] = [
    {
      key: 'findex',
      label: 'Findex statusunu dəyiş',
      icon: <Icons.AppstoreOutlined />,
      children: freelyTrueStatuses.map((status) => ({
        key: status.id,
        label: status.name,
        onClick: () => updateStatus(status.id),
      })),
    },
    ...(can('trendyol_state_change')
      ? [
          {
            key: 'trendyol',
            label: 'Trendyol statusunu dəyiş',
            icon: <Icons.AppstoreOutlined />,
            children: trendyolStatuses.map((status) => ({
              key: status.id,
              label: status.name,
              onClick: () => changeTrendyolStatus(status.id),
            })),
          },
        ]
      : []),
  ];

  const otherMenuItems: MenuProps['items'] = [
    {
      key: 'export',
      label: 'Export',
      icon: <Icons.FileExcelOutlined />,
      onClick: () => handleExport(buildQuery()),
    },
    {
      key: 'mini-export',
      label: 'Mini Export',
      icon: <Icons.FileExcelOutlined />,
      onClick: () => handleExport({ ...buildQuery(), mini: 1 }),
    },
  ];

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {!selection.length ? (
            <StyledHeaderButton type='text' onClick={selectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledActionBar.Selection>
              <Icons.CloseCircleTwoTone twoToneColor='#ff4d4f' onClick={resetSelection} style={{ cursor: 'pointer', fontSize: 16 }} role='icon' />
              <span>
                {selection.length} seçilib | Qiymət: {totalPrice.usd.toFixed(2)} USD | Çəki: {totalWeight.toFixed(2)}
              </span>
            </StyledActionBar.Selection>
          )}
          <StyledHeaderButton type='text' onClick={fetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type='text' onClick={reset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          <StyledHeaderButton type='text' disabled>
            Cəmi: {state.total}
          </StyledHeaderButton>
          {hasFilters &&
            (exportedData.length > 0 ? (
              <StyledHeaderButton type='text' onClick={handleDownloadCsv} icon={<Icons.FileExcelOutlined />}>
                Yüklə
              </StyledHeaderButton>
            ) : (
              <StyledHeaderButton type='text' onClick={() => handleExport(tableQueryMaker({ filters: state.filters, sortBy: state.sortBy, pageIndex: state.pageIndex, pageSize: state.pageSize }))} icon={<Icons.FileExcelOutlined />}>
                Export
              </StyledHeaderButton>
            ))}
        </Space>
        <Space>
          {!selection.length && can('parcel_excel_export') && (
            <Dropdown trigger={['click']} menu={{ items: otherMenuItems }}>
              <StyledHeaderButton type='text' icon={<Icons.DownCircleOutlined />}>
                Digər
              </StyledHeaderButton>
            </Dropdown>
          )}
          {hasFilters && !selection.length && can('parcel_state_bulk_change') && (
            <>
              <Dropdown trigger={['click']} menu={{ items: bulkStatusMenuItems }}>
                <StyledHeaderButton type='text' icon={<Icons.AppstoreOutlined />}>
                  Toplu status dəyiş
                </StyledHeaderButton>
              </Dropdown>
              <Dropdown trigger={['click']} menu={{ items: bulkTrendyolMenuItems }}>
                <StyledHeaderButton type='text' icon={<Icons.AppstoreOutlined />}>
                  Toplu trendyol statusu dəyiş
                </StyledHeaderButton>
              </Dropdown>
            </>
          )}
          {!!selection.length && can('parcel_state_bulk_change') && (
            <Dropdown trigger={['click']} menu={{ items: selectedStatusMenuItems }}>
              <StyledHeaderButton type='text' icon={<Icons.DownCircleOutlined />}>
                Seçilmişlər
              </StyledHeaderButton>
            </Dropdown>
          )}
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
