import { useContext } from 'react';
import { Select, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { MeContext } from '@modules/me';
import { SortingsTableContext } from '../context';
import { useSelectFlights } from '../hooks';

export const SortingsActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { handleFetch, handleReset, handleChangeFilterById } = useContext(SortingsTableContext);
  const { can } = useContext(MeContext);
  const flights = useSelectFlights();

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {can('parcel_sorting_create') && (
            <StyledHeaderButton type="text" onClick={() => navigate('/sorting/acceptance')} icon={<Icons.PlusCircleOutlined />}>
              Yeni göndəriş
            </StyledHeaderButton>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
        <Space>
          <Select style={{ minWidth: 280 }} mode="multiple" placeholder="Uçuş" allowClear showSearch optionFilterProp="children" onChange={(value) => handleChangeFilterById('flight_id', value)}>
            {flights.data?.map((flight) => (
              <Select.Option key={flight.id} value={flight.id}>
                #{flight.id} {flight.name}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
