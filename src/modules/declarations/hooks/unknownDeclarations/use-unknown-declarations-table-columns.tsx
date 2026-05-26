import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Modal, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { UnknownDeclarationsService } from '../../services';
import { IUnknownDeclaration } from '../../interfaces';
import { UnknownDeclarationsTableContext } from '../../context';

export const useUnknownDeclarationsTableColumns = (): Column<IUnknownDeclaration>[] => {
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(UnknownDeclarationsTableContext);

  return useMemo<Column<IUnknownDeclaration>[]>(
    () => [
      {
        ...nextTableColumns.actions,
        Cell: ({ row: { original } }: any) => (
          <StopPropagation>
            <Space size={4}>
              <Button
                icon={<Icons.FileSearchOutlined />}
                size='small'
                onClick={() => navigate(`/declarations/unknowns/${original.id}`, { withBackground: true })}
              />
              <Button
                icon={<Icons.CheckOutlined />}
                size='small'
                type='primary'
                ghost
                onClick={() => {
                  Modal.confirm({
                    title: 'Diqqət',
                    content: 'Bu bəyannaməni qəbul etmək istədiyinizdən əminsinizmi?',
                    onOk: async () => {
                      const result = await UnknownDeclarationsService.accept(original.id);
                      if (result.status === 200) { message.success('Qəbul edildi'); handleFetch(); }
                      else message.error(result.data as string);
                    },
                  });
                }}
              />
              <Button
                icon={<Icons.DeleteOutlined />}
                size='small'
                danger
                onClick={() => {
                  Modal.confirm({
                    title: 'Diqqət',
                    content: 'Ləğv etmək istədiyinizdən əminsinizmi?',
                    onOk: async () => {
                      const result = await UnknownDeclarationsService.cancel([original.id]);
                      if (result.status === 200) { message.success('Ləğv edildi'); handleFetch(); }
                      else message.error(result.data as string);
                    },
                  });
                }}
              />
            </Space>
          </StopPropagation>
        ),
      },
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.globalTrackCode, id: 'global_track_code', Header: 'Global izləmə kodu' },
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { accessor: (r) => r.user?.name ?? '—', id: 'user_name', Header: 'İstifadəçi' },
      { accessor: (r) => r.status.name, id: 'state_name', Header: 'Status' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılma tarixi' },
    ],
    [navigate, handleFetch],
  );
};
