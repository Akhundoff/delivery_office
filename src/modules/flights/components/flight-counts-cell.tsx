import { FC, useState } from 'react';
import { Descriptions, Popover, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';
import { FlightsService } from '../services';

export const FlightCountsCell: FC<{ value: any; row: { original: { id: number; count: number } } }> = ({ value, row }) => {
  const [visible, setVisible] = useState(false);

  const { data, isLoading, error } = useQuery(
    ['flights', row.original.id, 'counts'],
    () =>
      FlightsService.getFlightCounts(row.original.id).then((r) => {
        if (r.status === 200) return r.data;
        throw new Error(r.data as string);
      }),
    { enabled: visible },
  );

  const content = error ? (
    <span>{(error as Error).message}</span>
  ) : data ? (
    <Descriptions size="small" bordered column={1}>
      <Descriptions.Item label="Təhvil verilən">{data.handovers} ədəd</Descriptions.Item>
      <Descriptions.Item label="Ödənilmiş məbləğ">{data.paidAmount.toFixed(2)} $</Descriptions.Item>
    </Descriptions>
  ) : undefined;

  return (
    <Space>
      <Popover placement="bottom" trigger={['hover']} open={visible && !!data} onOpenChange={setVisible} content={content}>
        {isLoading ? <Icons.LoadingOutlined /> : <Icons.InfoCircleOutlined />}
      </Popover>
      <span>{row.original.count} ədəd</span>
    </Space>
  );
};
