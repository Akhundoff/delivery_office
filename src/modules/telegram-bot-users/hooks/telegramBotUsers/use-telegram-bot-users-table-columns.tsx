import { useCallback, useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Dropdown, InputNumber, Modal, Switch, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { ITelegramBotUser } from '../../interfaces';
import { TelegramBotUsersService } from '../../services';
import { TelegramBotUsersTableContext } from '../../context';

export const useTelegramBotUsersTableColumns = (): Column<ITelegramBotUser>[] => {
  const { handleFetch } = useContext(TelegramBotUsersTableContext);

  const handleGrant = useCallback((original: ITelegramBotUser) => {
    let inputValue: number | null = original.user.id;
    let hasAccess = original.hasAccess;

    Modal.confirm({
      title: `İstifadəçi${original.hasAccess ? 'ni' : 'yə'} ${original.hasAccess ? 'bloklamağa' : 'icazə verməyə'} əminsinizmi?`,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
          <InputNumber
            defaultValue={original.user.id ?? undefined}
            style={{ width: '100%' }}
            placeholder="Müştəri kodu daxil edin"
            onChange={(value) => { inputValue = value as number | null; }}
          />
          <Switch
            onChange={(value) => { hasAccess = value; }}
            checkedChildren="İcazə verilsin"
            unCheckedChildren="İcazə verilməsin"
            defaultChecked={hasAccess}
          />
        </div>
      ),
      onOk: async () => {
        const result = await TelegramBotUsersService.grant({
          id: original.id,
          user_id: inputValue ?? 0,
          has_access: hasAccess ? '1' : '0',
        });
        if (result.status === 200) {
          message.success('Əməliyyat uğurla tamamlandı.');
          handleFetch();
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [handleFetch]);

  return useMemo<Column<ITelegramBotUser>[]>(
    () => [
      {
        ...nextTableColumns.actions,
        id: 'actions',
        Header: '',
        Cell: ({ row }: any) => (
          <Dropdown
            menu={{
              items: [
                { key: 'grant', label: 'Düzəliş etmək', icon: <Icons.EditOutlined />, onClick: () => handleGrant(row.original) },
              ],
            }}
          >
            <Icons.MoreOutlined />
          </Dropdown>
        ),
      },
      { ...nextTableColumns.small, id: 'id', Header: 'Kod', accessor: (r) => r.id },
      { id: 'telegram_name', Header: 'Telegram adı', accessor: (r) => r.telegram.name },
      { id: 'telegram_id', Header: 'Telegram kodu', accessor: (r) => r.telegram.id },
      { id: 'user_id', Header: 'İstifadəçi kodu', accessor: (r) => r.user.id },
      {
        id: 'has_access',
        Header: 'İcazə',
        accessor: (r) => r.hasAccess,
        Cell: ({ row }: any) => (
          <Tag color={row.original.hasAccess ? 'green' : 'red'}>
            {row.original.hasAccess ? 'İcazəli' : 'İcazəsiz'}
          </Tag>
        ),
      },
      { ...nextTableColumns.date, id: 'created_at', Header: 'Yaradılıb', accessor: (r) => r.createdAt },
    ],
    [handleGrant],
  );
};
