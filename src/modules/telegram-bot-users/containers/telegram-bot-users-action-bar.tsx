import { useContext, useMemo } from 'react';
import { Popover, Space, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { MeContext } from '@modules/me/context/context';
import { TelegramBotUsersTableContext } from '../context';

export const TelegramBotUsersActionBar = () => {
  const { handleFetch, handleReset } = useContext(TelegramBotUsersTableContext);
  const { can } = useContext(MeContext);

  const popoverContent = useMemo(
    () => (
      <Space direction="vertical">
        <Typography.Text>Telegram bota bu linkdən rahatlıqla keçə bilərsiniz:</Typography.Text>
        <Typography.Link href="https://t.me/findex_delivery_bot" target="_blank">
          @findex_delivery_bot
        </Typography.Link>
        <Typography.Text>Açılan Telegram pəncərəsində "Başla" düyməsinə tıklayaraq botla əlaqə qurun.</Typography.Text>
      </Space>
    ),
    [],
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
          {can('telegram_grant') && (
            <Popover placement="bottom" content={popoverContent}>
              <StyledHeaderButton type="text" icon={<Icons.InfoCircleOutlined />} />
            </Popover>
          )}
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
