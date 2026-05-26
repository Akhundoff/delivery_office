import { useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { IPartnerDeclaration } from '../../interfaces';

export const usePartnerDeclarationsTableColumns = (): Column<IPartnerDeclaration>[] => {
  const navigate = useBackgroundNavigate();

  return useMemo<Column<IPartnerDeclaration>[]>(
    () => [
      {
        ...nextTableColumns.actions,
        Cell: ({ row: { original } }: any) => (
          <StopPropagation>
            <Space size={4}>
              <Button
                icon={<Icons.FileSearchOutlined />}
                size='small'
                onClick={() => navigate(`/declarations/${original.id}`, { withBackground: true })}
              />
            </Space>
          </StopPropagation>
        ),
      },
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.user.name, id: 'user_name', Header: 'İstifadəçi' },
      { accessor: (r) => r.partner.name, id: 'partner_name', Header: 'Partnyor' },
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { accessor: (r) => r.globalTrackCode ?? '—', id: 'global_track_code', Header: 'Global izləmə kodu' },
      { accessor: (r) => r.status.name, id: 'state_name', Header: 'Status' },
      { accessor: (r) => r.flight?.name ?? '—', id: 'flight_name', Header: 'Uçuş' },
      { accessor: (r) => (r.weight != null ? `${r.weight} kq` : '—'), id: 'weight', Header: 'Çəki' },
      { accessor: (r) => (r.paid ? 'Bəli' : 'Xeyr'), id: 'paid', Header: 'Ödənilib' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılma tarixi' },
    ],
    [navigate],
  );
};
