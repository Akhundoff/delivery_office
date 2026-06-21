import { useCallback, useContext } from 'react';
import { Input, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { DnsQueuesTableContext } from '../context';

export const DnsQueuesActionBar = () => {
  const { handleFetch, handleReset, handleChangeFilterById } = useContext(DnsQueuesTableContext);

  const onSearch = useCallback(
    (value: string) => {
      handleChangeFilterById('tracking_no', value || undefined);
    },
    [handleChangeFilterById],
  );

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
        <Space>
          <Input.Search placeholder="İzləmə kodu ilə axtar..." onSearch={onSearch} allowClear style={{ width: 260 }} />
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
