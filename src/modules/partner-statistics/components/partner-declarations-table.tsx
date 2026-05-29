import { FC, useCallback, useMemo } from 'react';
import { Col, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import groupBy from 'lodash/groupBy';
import dayjs from 'dayjs';
import { IPartnerDeclarationStatistic } from '../interfaces';

export const PartnerDeclarationsTable: FC<{ data: IPartnerDeclarationStatistic[] }> = ({ data }) => {
  const groupedData = useMemo(() => groupBy(data, (item) => item.updatedAt.substring(0, 7)), [data]);

  const columns = useMemo<ColumnType<IPartnerDeclarationStatistic>[]>(
    () => [
      { key: 'updatedAt', dataIndex: 'updatedAt', title: 'Tarix' },
      { key: 'count', dataIndex: 'count', title: 'Say', render: (v) => `${v} ədəd` },
    ],
    [],
  );

  const renderTitle = useCallback((month: string) => {
    const date = dayjs(month, 'YYYY-MM');
    return `${date.startOf('month').format('DD.MM.YYYY')} - ${date.endOf('month').format('DD.MM.YYYY')}`;
  }, []);

  return (
    <Row gutter={[12, 12]}>
      {Object.entries(groupedData).map(([month, items]) => (
        <Col key={month} xs={24} lg={12}>
          <Table title={() => renderTitle(month)} size='small' bordered={true} columns={columns} rowKey='id' dataSource={items} pagination={false} />
        </Col>
      ))}
    </Row>
  );
};
