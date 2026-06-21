import { useMemo, useState } from 'react';
import { Column } from 'react-table';
import { Button, Modal } from 'antd';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { IDeliveryProof } from '../../interfaces';

const FileCell = ({ fileUrl }: { fileUrl: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="link" size="small" onClick={() => setOpen(true)}>
        Sənədə bax
      </Button>
      <Modal width={800} title="Sənəd" open={open} footer={null} onCancel={() => setOpen(false)} destroyOnClose>
        {fileUrl ? <iframe src={fileUrl} title="Sənədə baxış" style={{ width: '100%', height: 400, border: 'none' }} /> : <p>Sənəd yoxdur</p>}
      </Modal>
    </>
  );
};

export const useDeliveryProofsTableColumns = (): Column<IDeliveryProof>[] => {
  return useMemo<Column<IDeliveryProof>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { accessor: (r) => r.declarationId, id: 'declaration_id', Header: 'Bağlama ID' },
      { accessor: (r) => r.user?.name, id: 'user_name', Header: 'İstifadəçi' },
      {
        accessor: (r) => r.fileUrl,
        id: 'file_url',
        Header: 'Sənəd',
        Cell: ({ row }: any) => <FileCell fileUrl={row.original.fileUrl} />,
      },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
    ],
    [],
  );
};
