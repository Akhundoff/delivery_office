import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { MeContext } from '@modules/me';
import { PartnerBoxesService } from '../../services';
import { IPartnerBox } from '../../interfaces';
import { PartnerBoxesTableContext } from '../../context';

export const usePartnerBoxesTableColumns = (): Column<IPartnerBox>[] => {
  const { handleFetch } = useContext(PartnerBoxesTableContext);
  const { can } = useContext(MeContext);
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<IPartnerBox>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          ...(can('branch_manager')
            ? [
                { key: 'edit', label: 'Düzəliş et', icon: <Icons.EditOutlined />, onClick: () => navigate(`/partner-boxes/${original.id}/update`, { withBackground: true }) },
                { type: 'divider' as const },
                {
                  key: 'delete',
                  label: 'Sil',
                  icon: <Icons.DeleteOutlined />,
                  danger: true,
                  onClick: () =>
                    Modal.confirm({
                      title: 'Diqqət',
                      content: 'Yeşiyi silməyə əminsinizmi?',
                      okText: 'Sil',
                      okType: 'danger',
                      cancelText: 'Ləğv et',
                      onOk: async () => {
                        const r = await PartnerBoxesService.delete([original.id]);
                        if (r.status === 200) handleFetch();
                        else message.error(r.data as string);
                      },
                    }),
                },
              ]
            : []),
        ];
        return (
          <StopPropagation>
            <Dropdown menu={{ items }} trigger={['hover']}>
              <Button icon={<Icons.MoreOutlined />} size="small" />
            </Dropdown>
          </StopPropagation>
        );
      },
    }),
    [navigate, handleFetch, can],
  );

  const baseColumns = useMemo<Column<IPartnerBox>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.name, id: 'container_name', Header: 'Ad' },
      { ...nextTableColumns.large, accessor: (r) => r.user?.name || '—', id: 'user_id', Header: 'Təhkim olunan' },
      { ...nextTableColumns.normal, accessor: (r) => r.declarationCount, id: 'declaration_count', Header: 'Bağlama sayı', filterable: false, Cell: ({ cell: { value } }: any) => `${value} ədəd` },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılma tarixi' },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
