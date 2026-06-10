import React, { useContext } from 'react';
import { Dropdown, MenuProps, Modal, Select, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatusesService } from '@modules/statuses/services';
import { SupportsTableContext } from '../context';
import { SupportsService } from '../services';

export const SupportsActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection, handleChangeFilterById } = useContext(SupportsTableContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;
  const selectedIds = Object.keys(state.selectedRowIds).map(Number);

  const { data: statusesResult } = useQuery(['statuses-for-supports-bar', 9], () => StatusesService.getList({ per_page: 500, model_id: 9 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const remove = () =>
    Modal.confirm({
      title: 'Diqqət',
      content: 'Müraciətləri silməyə əminsinizmi?',
      okType: 'danger',
      okText: 'Sil',
      cancelText: 'Ləğv et',
      onOk: async () => {
        const result = await SupportsService.cancel(selectedIds);
        if (result.status === 200) { message.success('Müraciətlər silindi.'); handleFetch(); handleResetSelection(); }
        else message.error(result.data as string);
      },
    });

  const statusItems: MenuProps['items'] = statuses.map((s) => ({
    key: `bulk-status-${s.id}`,
    label: s.name,
    onClick: async () => {
      const result = await SupportsService.changeStatus(selectedIds, s.id);
      if (result.status === 200) { message.success('Status dəyişdirildi.'); handleFetch(); handleResetSelection(); }
      else message.error(result.data as string);
    },
  }));

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type='text' onClick={() => navigate('/supports/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Yeni
          </StyledHeaderButton>
          <StyledHeaderButton type='text' onClick={() => navigate('/supports/categories', { withBackground: true })} icon={<Icons.AppstoreAddOutlined />}>
            Kateqoriyalar
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
          {!!selectionCount && (
            <>
              <Dropdown menu={{ items: statusItems }} trigger={['click']}>
                <StyledHeaderButton type='text' icon={<Icons.AppstoreOutlined />}>Statusu dəyiş</StyledHeaderButton>
              </Dropdown>
              <StyledHeaderButton type='text' danger onClick={remove} icon={<Icons.DeleteOutlined />}>
                Sil
              </StyledHeaderButton>
            </>
          )}
          <Select
            placeholder='Oxunmaya görə filterlə'
            style={{ width: 188 }}
            value={state.filters.find((filter) => filter.id === 'is_new_admin')?.value}
            onChange={(value) => handleChangeFilterById('is_new_admin', value)}
            allowClear={true}
          >
            <Select.Option value='0'>Oxunmuş</Select.Option>
            <Select.Option value='1'>Oxunmamış</Select.Option>
          </Select>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
