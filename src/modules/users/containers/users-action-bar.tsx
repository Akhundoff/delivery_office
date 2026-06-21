import React, { useCallback, useContext, useMemo } from 'react';
import * as Icons from '@ant-design/icons';
import { Select, Space, message } from 'antd';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { tableFilterQueryMaker } from '@shared/modules/next-table/utils';
import { MeContext } from '@modules/me';
import { useStatuses } from '@modules/statuses/hooks';
import { UsersTableContext } from '../context';
import { UsersService } from '../services';
import { userQueryKeys } from '../utils';

const roleOptions = [
  { value: '1', label: 'Admin' },
  { value: '2', label: 'Anbardar' },
  { value: '3', label: 'Back Office' },
  { value: '4', label: 'Partner' },
];

export const UsersActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { can } = useContext(MeContext);
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection, handleChangeFilterById } = useContext(UsersTableContext);
  const selectionCount = Object.values(state.selectedRowIds).filter(Boolean).length;

  const declarationStatuses = useStatuses({ model_id: 2 });

  const roleFilterValue = useMemo(() => state.filters.find((f) => f.id === userQueryKeys.role)?.value ?? undefined, [state.filters]);
  const declarationStateValue = useMemo(() => state.filters.find((f) => f.id === userQueryKeys.declarations.state.id)?.value ?? undefined, [state.filters]);
  const mobileAppValue = useMemo(() => state.filters.find((f) => f.id === userQueryKeys.mobileAppUser)?.value ?? undefined, [state.filters]);

  const handleExport = useCallback(async () => {
    message.loading({ key: 'users-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await UsersService.exportExcel(tableFilterQueryMaker(state.filters));
    if (result.status === 200) {
      message.success({ key: 'users-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `users_export_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
    } else {
      message.error({ key: 'users-export', content: result.data as string });
    }
  }, [state.filters]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={() => navigate('/users/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Yeni
          </StyledHeaderButton>
          {!selectionCount ? (
            <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledActionBar.Selection>
              <Icons.CloseCircleTwoTone twoToneColor="#ff4d4f" onClick={handleResetSelection} style={{ cursor: 'pointer', fontSize: 16 }} role="icon" />
              <span>{selectionCount} seçilib</span>
            </StyledActionBar.Selection>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          {can('user_edit') && (
            <StyledHeaderButton type="text" onClick={handleExport} icon={<Icons.DownloadOutlined />}>
              Export
            </StyledHeaderButton>
          )}
        </Space>

        {!selectionCount && (
          <Space wrap>
            {can('admins') && (
              <Select
                allowClear
                placeholder="Rol"
                style={{ width: 140 }}
                value={roleFilterValue}
                onChange={(val) => handleChangeFilterById(userQueryKeys.role, val ?? undefined)}
                options={roleOptions}
              />
            )}
            <Select
              allowClear
              mode="multiple"
              maxTagCount="responsive"
              placeholder="Bağlama statusu"
              style={{ minWidth: 180 }}
              value={declarationStateValue}
              loading={declarationStatuses.isLoading}
              onChange={(val) => handleChangeFilterById(userQueryKeys.declarations.state.id, val?.length ? val : undefined)}
            >
              {declarationStatuses.data?.map((s) => (
                <Select.Option key={s.id} value={s.id.toString()}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
            <Select allowClear placeholder="Mobil tətbiq" style={{ width: 140 }} value={mobileAppValue} onChange={(val) => handleChangeFilterById(userQueryKeys.mobileAppUser, val ?? undefined)}>
              <Select.Option value="1">Var</Select.Option>
              <Select.Option value="0">Yoxdur</Select.Option>
            </Select>
            <StyledHeaderButton type="text" onClick={() => navigate('/statistics/qizil-onluq', { withBackground: false })} icon={<Icons.TrophyOutlined />}>
              Qızıl onluq
            </StyledHeaderButton>
            <StyledHeaderButton type="text" onClick={() => navigate('/users/discounts', { withBackground: false })} icon={<Icons.TagOutlined />}>
              Endirimli müştərilər
            </StyledHeaderButton>
          </Space>
        )}
      </StyledActionBar>
    </HeadPortal>
  );
};
