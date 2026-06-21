import React, { useCallback, useContext, useMemo } from 'react';
import { Dropdown, MenuProps, Modal, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { tableFilterQueryMaker } from '@shared/modules/next-table/utils';
import { urlMaker } from '@shared/utils';
import { StatusesService } from '@modules/statuses/services';
import { CouriersTableContext } from '../context';
import { CouriersService } from '../services';

export const CouriersActionBar = () => {
  const backgroundNavigate = useBackgroundNavigate();
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(CouriersTableContext);
  const selectionCount = Object.values(state.selectedRowIds).filter(Boolean).length;
  const selectedIds = useMemo(
    () =>
      Object.entries(state.selectedRowIds)
        .filter(([, v]) => v)
        .map(([k]) => Number(k)),
    [state.selectedRowIds],
  );

  const { data: statusesResult } = useQuery(['statuses-for-couriers-bar', 3], () => StatusesService.getList({ per_page: 500, model_id: 3 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const filterQuery = useMemo(() => tableFilterQueryMaker(state.filters), [state.filters]);

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'couriers-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await CouriersService.getExcel(filterQuery);
    if (result.status === 200) {
      message.success({ key: 'couriers-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `couriers_export_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
    } else {
      message.error({ key: 'couriers-export', content: result.data as string });
    }
  }, [filterQuery]);

  const printBulkHanding = useCallback(() => {
    const token = Cookies.get('accessToken') || '';
    window.open(urlMaker('/api/admin/couriers/handing', { ...filterQuery, Authorization: token }));
  }, [filterQuery]);

  const printAzerpostBulk = useCallback(() => {
    const token = Cookies.get('accessToken') || '';
    window.open(urlMaker('/api/admin/couriers/azerpost/handing', { ...filterQuery, Authorization: token }));
  }, [filterQuery]);

  const bulkStatusItems: MenuProps['items'] = statuses.map((s) => ({
    key: `bulk-status-${s.id}`,
    label: s.name,
    onClick: () =>
      Modal.confirm({
        title: 'Diqqət',
        content: `${state.total} kuryer seçilib. Toplu status dəyişməyə əminsinizmi?`,
        onOk: async () => {
          const result = await CouriersService.bulkChangeStatus(filterQuery, s.id);
          if (result.status === 200) {
            message.success('Status dəyişdirildi.');
            handleFetch();
          } else message.error(result.data as string);
        },
      }),
  }));

  const selectionStatusItems: MenuProps['items'] = statuses
    .filter((s) => s.id !== 13 && s.id !== 14)
    .map((s) => ({
      key: `sel-status-${s.id}`,
      label: s.name,
      onClick: async () => {
        const result = await CouriersService.changeStatus(selectedIds, s.id);
        if (result.status === 200) {
          message.success('Status dəyişdirildi.');
          handleFetch();
          handleResetSelection();
        } else message.error(result.data as string);
      },
    }));

  const azerpostItems: MenuProps['items'] = [
    {
      key: 'az-create',
      label: 'Azərpoçta göndər',
      onClick: async () => {
        message.loading({ key: 'az-create', content: 'Göndərilir...', duration: 0 });
        const result = await CouriersService.azerpostCreate(selectedIds);
        message.destroy('az-create');
        if (result.status === 200) {
          message.success('Göndərildi.');
          handleFetch();
        } else message.error(result.data as string);
      },
    },
    {
      key: 'az-delete',
      label: 'Azərpoçtdan sil',
      danger: true,
      onClick: async () => {
        message.loading({ key: 'az-delete', content: 'Silinir...', duration: 0 });
        const result = await CouriersService.azerpostDelete(selectedIds);
        message.destroy('az-delete');
        if (result.status === 200) {
          message.success('Silindi.');
          handleFetch();
        } else message.error(result.data as string);
      },
    },
    {
      key: 'az-paid',
      label: 'Ödənilmiş et',
      onClick: async () => {
        const result = await CouriersService.azerpostChangeStatus(selectedIds, 1);
        if (result.status === 200) {
          message.success('Status dəyişdirildi.');
          handleFetch();
        } else message.error(result.data as string);
      },
    },
    {
      key: 'az-unpaid',
      label: 'Ödənilməmiş et',
      onClick: async () => {
        const result = await CouriersService.azerpostChangeStatus(selectedIds, 0);
        if (result.status === 200) {
          message.success('Status dəyişdirildi.');
          handleFetch();
        } else message.error(result.data as string);
      },
    },
  ];

  const removeSelected = useCallback(() => {
    Modal.confirm({
      title: 'Diqqət',
      content: 'Seçilmiş kuryerləri silməyə əminsinizmi?',
      okType: 'danger',
      okText: 'Sil',
      cancelText: 'Ləğv et',
      onOk: async () => {
        const result = await CouriersService.cancel(selectedIds);
        if (result.status === 200) {
          message.success('Kuryerlər silindi.');
          handleFetch();
          handleResetSelection();
        } else message.error(result.data as string);
      },
    });
  }, [selectedIds, handleFetch, handleResetSelection]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={() => backgroundNavigate('/couriers/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Yeni kuryer
          </StyledHeaderButton>
          {!selectionCount ? (
            <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledActionBar.Selection>
              <Icons.CloseCircleTwoTone twoToneColor="#ff4d4f" onClick={handleResetSelection} style={{ cursor: 'pointer', fontSize: 16 }} role="icon" />
              <span>{selectionCount} sətir seçilib</span>
            </StyledActionBar.Selection>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          <StyledHeaderButton type="text" disabled>
            Cəmi: {state.total}
          </StyledHeaderButton>
        </Space>
        <Space>
          {!!selectionCount ? (
            <>
              <StyledHeaderButton type="text" icon={<Icons.UserAddOutlined />} onClick={() => backgroundNavigate(`/couriers/${selectedIds.join(',')}/assign-deliverer`, { withBackground: true })}>
                Təhkim et
              </StyledHeaderButton>
              <Dropdown menu={{ items: selectionStatusItems }} trigger={['click']}>
                <StyledHeaderButton type="text" icon={<Icons.AppstoreOutlined />}>
                  Statusu dəyiş
                </StyledHeaderButton>
              </Dropdown>
              <Dropdown menu={{ items: azerpostItems }} trigger={['click']}>
                <StyledHeaderButton type="text" icon={<Icons.CloudUploadOutlined />}>
                  Azərpoçt
                </StyledHeaderButton>
              </Dropdown>
              <StyledHeaderButton type="text" icon={<Icons.CheckCircleOutlined />} onClick={() => backgroundNavigate(`/couriers/${selectedIds.join(',')}/handover`, { withBackground: true })}>
                Təhvil ver
              </StyledHeaderButton>
              <StyledHeaderButton type="text" danger icon={<Icons.DeleteOutlined />} onClick={removeSelected}>
                Sil
              </StyledHeaderButton>
            </>
          ) : (
            <>
              <Dropdown menu={{ items: bulkStatusItems }} trigger={['click']}>
                <StyledHeaderButton type="text" icon={<Icons.AppstoreOutlined />}>
                  Toplu status dəyiş
                </StyledHeaderButton>
              </Dropdown>
              <StyledHeaderButton type="text" onClick={printBulkHanding} icon={<Icons.FileTextOutlined />}>
                Təhvil sənədi
              </StyledHeaderButton>
              <StyledHeaderButton type="text" onClick={printAzerpostBulk} icon={<Icons.FileTextOutlined />}>
                Azərpoçt sənədi
              </StyledHeaderButton>
              <StyledHeaderButton type="text" onClick={exportAsExcel} icon={<Icons.FileExcelOutlined />}>
                Excel export
              </StyledHeaderButton>
              <StyledHeaderButton type="text" icon={<Icons.BarChartOutlined />} onClick={() => backgroundNavigate('/statistics/couriers/general', { withBackground: true })} />
            </>
          )}
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
