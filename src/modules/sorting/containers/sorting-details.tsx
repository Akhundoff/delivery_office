import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Card, Col, Descriptions, Radio, Result, Row, Spin, Table } from 'antd';
import * as Icons from '@ant-design/icons';
import { PageContent } from '@shared/styled/page-content';
import { NextTable } from '@shared/modules/next-table/containers';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { SortingDeclarationsTableContext } from '../context';
import { sortingDeclarationsTableFetchUseCase } from '../use-cases/table-fetch';
import { useSortingDeclarationsTableColumns } from '../hooks';
import { SortingService } from '../services';
import { SortingDeclarationsView } from '../interfaces';

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
  const [view, setView] = useState<SortingDeclarationsView>('total');

  const { data, isLoading, error } = useQuery(
    ['sorting-transfer-info', id],
    async () => {
      const result = await SortingService.getTransferInfo(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
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
        <Col xs={24}>
          <Radio.Group value={view} onChange={(e) => setView(e.target.value)} style={{ marginBottom: 16 }}>
            <Radio.Button value="total">
              <Icons.UnorderedListOutlined /> Bütün
            </Radio.Button>
            <Radio.Button value="another">
              <Icons.CheckOutlined /> Digər uçuşa aid
            </Radio.Button>
            <Radio.Button value="missing">
              <Icons.CloseOutlined /> Əskik bağlamalar
            </Radio.Button>
          </Radio.Group>
          <DeclarationsTable id={id!} view={view} />
        </Col>
      </Row>
    </PageContent>
  );
};
