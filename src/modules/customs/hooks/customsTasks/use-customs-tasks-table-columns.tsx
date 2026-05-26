import { useMemo } from 'react';
import { Column } from 'react-table';
import { Button } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { ICustomsTask } from '../../interfaces';

export const useCustomsTasksTableColumns = (): Column<ICustomsTask>[] => {
  const navigate = useBackgroundNavigate();

  return useMemo<Column<ICustomsTask>[]>(
    () => [
      {
        ...nextTableColumns.actions,
        Cell: ({ row: { original } }: any) => (
          <StopPropagation>
            <Button
              icon={<Icons.FileSearchOutlined />}
              size='small'
              onClick={() => navigate(`/customs/tasks/${original.id}`, { withBackground: true })}
            />
          </StopPropagation>
        ),
      },
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.action, id: 'action', Header: 'Əməliyyat' },
      { accessor: (r) => r.declaration.globalTrackCode, id: 'global_track_code', Header: 'İzləmə kodu' },
      { accessor: (r) => r.declaration.user.name, id: 'user_name', Header: 'İstifadəçi' },
      { accessor: (r) => r.branch.name, id: 'branch_name', Header: 'Filial' },
      { accessor: (r) => r.status.name, id: 'state_name', Header: 'Status' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılma tarixi' },
    ],
    [navigate],
  );
};
