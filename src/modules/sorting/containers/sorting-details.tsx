import { FC, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { Card, Col, Descriptions, Radio, Result, Row, Space, Spin, Table, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { PageContent } from '@shared/styled/page-content';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledActionBar } from '@shared/styled/action-bar';
import { StyledHeaderButton } from '@modules/layout/styled';
import { useBackgroundNavigate } from '@shared/hooks';
import { NextTable } from '@shared/modules/next-table/containers';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { SortingDeclarationsTableContext } from '../context';
import { sortingDeclarationsTableFetchUseCase } from '../use-cases/table-fetch';
import { useSortingDeclarationsTableColumns } from '../hooks';
import { SortingService } from '../services';
import { IAzeriExpressInfo, SortingDeclarationsView } from '../interfaces';

const DeclarationsTable: FC<{ id: string; view: SortingDeclarationsView }> = ({ id, view }) => {
  const columns = useSortingDeclarationsTableColumns();
  return (
    <NextTableProvider key={`${id}-${view}`} context={SortingDeclarationsTableContext} onFetch={sortingDeclarationsTableFetchUseCase(id, view)} name={`sorting-declarations-${view}`}>
      <NextTable context={SortingDeclarationsTableContext} columns={columns} />
    </NextTableProvider>
  );
};

export const SortingDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useBackgroundNavigate();
  const [sending, setSending] = useState(false);
  const [view, setView] = useState<SortingDeclarationsView>('total');
  const queryClient = useQueryClient();

  const handleSend = useCallback(async () => {
    setSending(true);
    message.loading({ content: 'Əməliyyat aparılır...', key: 'sorting-send' });
    const result = await SortingService.send(Number(id));
    message.destroy('sorting-send');
    setSending(false);
    if (result.status === 200) {
      message.success(result.data as string);
      queryClient.invalidateQueries(['sorting-transfer-info', id]);
      navigate('/sorting');
    } else {
      message.error(result.data as string);
    }
  }, [id, navigate, queryClient]);

  const { data, isLoading, error } = useQuery(
    ['sorting-transfer-info', id],
    async () => {
      const result = await SortingService.getTransferInfo(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const { data: azeriExpressData } = useQuery<IAzeriExpressInfo | null>(
    ['sorting-azeriexpress-info', id],
    async () => {
      const result = await SortingService.getAzeriExpressInfo(id!);
      return result.status === 200 ? result.data : null;
    },
    { enabled: !!id && !!data?.isSendAzeriExpress },
  );

  if (isLoading) {
    return (
      <PageContent>
        <Spin style={{ display: 'block', padding: '60px 0', textAlign: 'center' }} />
      </PageContent>
    );
  }

  if (error) {
    return (
      <PageContent>
        <Result status="404" title="Xəta baş verdi" subTitle={(error as Error).message} />
      </PageContent>
    );
  }

  if (!data) return null;

  return (
    <PageContent>
      <HeadPortal>
        <StyledActionBar $flex={true}>
          <Space>
            {!data.isSendAzeriExpress && (
              <StyledHeaderButton type="text" loading={sending} onClick={handleSend} icon={<Icons.SendOutlined />}>
                Transferi göndər
              </StyledHeaderButton>
            )}
            {!data.isSendAzeriExpress && (
              <StyledHeaderButton type="text" onClick={() => navigate(`/sorting/${id}/send`, { withBackground: true })} icon={<Icons.TransactionOutlined />}>
                AzəriExpress API
              </StyledHeaderButton>
            )}
          </Space>
        </StyledActionBar>
      </HeadPortal>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Ümumi məlumat" size="small">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Status">{data.state.name}</Descriptions.Item>
              <Descriptions.Item label="Bütün göndərilən bağlamalar">{data.declaration.all}</Descriptions.Item>
              <Descriptions.Item label="Bu uçuş(lar)a aid bütün bağlamalar">{data.declaration.thisFlight}</Descriptions.Item>
              <Descriptions.Item label="Bu uçuş(lar)a aid göndərilən bağlamalar">{data.declaration.count}</Descriptions.Item>
              <Descriptions.Item label="Bu uçuş(lar)a aid göndərilməyən bağlamalar">{data.declaration.missing}</Descriptions.Item>
              <Descriptions.Item label="Başqa uçuş(lar)a aid bağlamalar">{data.declaration.anotherFlight}</Descriptions.Item>
              <Descriptions.Item label="Filial">{data.branch.name}</Descriptions.Item>
              <Descriptions.Item label="İcraçı">{data.user.id}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Uçuş məlumatları" size="small">
            <Table rowKey="id" dataSource={data.flights} size="small" bordered pagination={false}>
              <Table.Column title="Uçuş №" dataIndex="flightId" key="flightId" />
              <Table.Column title="Uçuş adı" dataIndex="flightName" key="flightName" />
              <Table.Column title="Cəmi bağlama" dataIndex="totalDeclarations" key="totalDeclarations" />
              <Table.Column title="Göndərilən" dataIndex="sortingDeclarations" key="sortingDeclarations" />
              <Table.Column title="Göndərilməyən" dataIndex="notSortingDeclarations" key="notSortingDeclarations" />
            </Table>
          </Card>
        </Col>
        {azeriExpressData && (
          <>
            <Col xs={24} lg={12}>
              <Card title="AzəriExpress Məlumatları" size="small">
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Göndərən adı">{azeriExpressData.senderName || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Göndərən telefon">{azeriExpressData.formattedSenderMobile || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Göndərən email">{azeriExpressData.senderEmail || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Qəbul edən adı">{azeriExpressData.receiverName || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Qəbul edən telefon">{azeriExpressData.formattedReceiverMobile || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Qəbul edən email">{azeriExpressData.receiverEmail || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Barkod nömrəsi">{azeriExpressData.barcodeFullNumber || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Status">{azeriExpressData.statusText || '—'}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="AzəriExpress Əlavə Məlumat" size="small">
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Prioritet">{azeriExpressData.priorityText || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Çəki">{azeriExpressData.weight} kg</Descriptions.Item>
                  <Descriptions.Item label="Məsafə">{azeriExpressData.distance} km</Descriptions.Item>
                  <Descriptions.Item label="Bağlama məzmunu">{azeriExpressData.packageContents || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Götürmə üçün qeyd">{azeriExpressData.pickupInstructions || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Çatdırılma üçün qeyd">{azeriExpressData.deliveryInstructions || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Yaradılma tarixi">{azeriExpressData.createdAt || '—'}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </>
        )}
        <Col xs={24}>
          <Radio.Group value={view} onChange={(e) => setView(e.target.value)} style={{ marginBottom: 16 }}>
            <Radio.Button value="total">
              <Icons.UnorderedListOutlined /> Bütün
            </Radio.Button>
            <Radio.Button value="another">
              <Icons.CheckOutlined /> Digər uçuşa aid
            </Radio.Button>
            <Radio.Button value="sorting">
              <Icons.CheckOutlined /> Yalnız uçuşa aid
            </Radio.Button>
            <Radio.Button value="missing">
              <Icons.CloseOutlined /> Göndərilməyən bağlamalar
            </Radio.Button>
          </Radio.Group>
          <DeclarationsTable id={id!} view={view} />
        </Col>
      </Row>
    </PageContent>
  );
};
