import { FC, useContext } from 'react';
import { Select, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { MeContext } from '@modules/me';
import { SortingsTableContext } from '../context';
import { useSelectFlights } from '../hooks';

export const SortingsActionBar: FC = () => {
  const navigate = useBackgroundNavigate();
  const { handleFetch, handleReset, handleChangeFilterById, handleSelectAll, handleResetSelection, state } = useContext(SortingsTableContext);
  const { can } = useContext(MeContext);
  const flights = useSelectFlights();
  const selectionCount = Object.keys(state.selectedRowIds).length;

  return (
    <>
      <HeadPortal>
        <StyledActionBar $flex={true}>
          <Space size={0}>
            {can('parcel_sorting_create') && (
              <StyledHeaderButton type="text" onClick={() => navigate('/sorting/acceptance')} icon={<Icons.PlusCircleOutlined />}>
                Yeni göndəriş
              </StyledHeaderButton>
            )}
            {!selectionCount ? (
              <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
                Hamısını seç
              </StyledHeaderButton>
            ) : (
              <StyledHeaderButton type="text" onClick={handleResetSelection} icon={<Icons.CloseCircleOutlined />}>
                {selectionCount} sətir seçilib
              </StyledHeaderButton>
            )}
            <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
              Yenilə
            </StyledHeaderButton>
            <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
              Sıfırla
            </StyledHeaderButton>
          </Space>
        </StyledActionBar>
      </HeadPortal>
      <Space size={8}>
        <Select style={{ minWidth: 300 }} mode="multiple" placeholder="Uçuş" allowClear showSearch optionFilterProp="children" onChange={(value) => handleChangeFilterById('flight_id', value)}>
          {flights.data?.map((flight) => (
            <Select.Option key={flight.id} value={flight.id}>
              #{flight.id} {flight.name}
            </Select.Option>
          ))}
        </Select>
      </Space>
    </>
  );
};
