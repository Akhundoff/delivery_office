import { FC, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Collapse, Descriptions, Modal, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';
import { useCloseModal, useBackgroundNavigate } from '@shared/hooks';
import { NextTable } from '@shared/modules/next-table/containers';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { SortingDeclarationsTableContext } from '../context';
import { sortingDeclarationsTableFetchUseCase } from '../use-cases/table-fetch';
import { useSortingDeclarationsTableColumns } from '../hooks';
import { SortingService } from '../services';
import { SortingDeclarationsView } from '../interfaces';

const DeclarationsSubModal: FC<{ open: boolean; onClose: () => void; id: string; view: SortingDeclarationsView }> = ({ open, onClose, id, view }) => {
  const columns = useSortingDeclarationsTableColumns();
  if (!open) return null;
  return (
    <Modal open style={{ top: 20 }} width={1024} onCancel={onClose} footer={null}>
      <NextTableProvider context={SortingDeclarationsTableContext} onFetch={sortingDeclarationsTableFetchUseCase(id, view)} name={`sorting-info-${view}`}>
        <NextTable context={SortingDeclarationsTableContext} columns={columns} />
      </NextTableProvider>
    </Modal>
  );
};

export const SortingInfoModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [closeModal] = useCloseModal();
  const navigate = useBackgroundNavigate();
  const [view, setView] = useState<SortingDeclarationsView | null>(null);
  const [sending, setSending] = useState(false);

  const { data } = useQuery(
    ['sorting-transfer-info', id],
    async () => {
      const result = await SortingService.getTransferInfo(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const handleClose = useCallback(() => closeModal(`/sorting/${id}`), [closeModal, id]);

  const handleExecute = useCallback(async () => {
    setSending(true);
    message.loading({ content: 'Əməliyyat aparılır...', key: 'sorting-execute' });
    const result = await SortingService.send(Number(id));
    message.destroy('sorting-execute');
    setSending(false);
    if (result.status === 200) {
      message.success(result.data as string);
      navigate(`/sorting/${id}`);
    } else {
      message.error(result.data as string);
    }
  }, [id, navigate]);

  const footer = useMemo(
    () => (
      <Button disabled={sending} type="primary" loading={sending} onClick={handleExecute}>
        Transferi göndər
      </Button>
    ),
    [handleExecute, sending],
  );

  if (!data) return null;

  return (
    <>
      <Modal open width={768} onCancel={handleClose} footer={footer} title="Göndərişi yoxlamaq">
        <Descriptions labelStyle={{ width: '30%' }} bordered column={1} size="small">
          <Descriptions.Item label="Bütün göndərilən bağlamalar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{data.declaration.all}</span>
              <Button onClick={() => setView('total')} size="small" icon={<Icons.OrderedListOutlined />}>
                Bağlamalar
              </Button>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Bu uçuş(lar)a aid daxil edilən">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{data.declaration.count}</span>
              <Button onClick={() => setView('sorting')} size="small" icon={<Icons.OrderedListOutlined />}>
                Bağlamalar
              </Button>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Əskik bağlamalar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{data.declaration.missing}</span>
              <Button onClick={() => setView('missing')} size="small" icon={<Icons.OrderedListOutlined />}>
                Bağlamalar
              </Button>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Bu uçuşa aid olmalı">{data.declaration.thisFlight}</Descriptions.Item>
          <Descriptions.Item label="Başqa uçuş(lar)a aid">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{data.declaration.anotherFlight}</span>
              <Button onClick={() => setView('another')} size="small" icon={<Icons.OrderedListOutlined />}>
                Bağlamalar
              </Button>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="İcraçı">{data.user.id}</Descriptions.Item>
          <Descriptions.Item label="Uçuşlar">
            <Collapse bordered>
              {data.flights.map((flight) => (
                <Collapse.Panel header={flight.flightId} key={flight.flightId}>
                  <Descriptions>
                    <Descriptions.Item label="Uçuş №">{flight.flightId}</Descriptions.Item>
                    <Descriptions.Item label="Bütün bağlamalar">{flight.totalDeclarations}</Descriptions.Item>
                    <Descriptions.Item label="Çeşidlənmiş">{flight.sortingDeclarations}</Descriptions.Item>
                    <Descriptions.Item label="Çeşidlənməmiş">{flight.notSortingDeclarations}</Descriptions.Item>
                  </Descriptions>
                </Collapse.Panel>
              ))}
            </Collapse>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      {view && <DeclarationsSubModal open={!!view} onClose={() => setView(null)} id={id!} view={view} />}
    </>
  );
};
