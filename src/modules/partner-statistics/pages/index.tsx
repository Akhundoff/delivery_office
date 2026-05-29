import { FC, useCallback, useMemo, useState } from 'react';
import { Button, DatePicker, Empty, Radio, Select, Space, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { PageContent } from '@shared/styled/page-content';
import { useBranchPartners, usePartnerDeclarationStatistics } from '../hooks';
import { PartnerDeclarationsChart } from '../components/partner-declarations-chart';
import { PartnerDeclarationsTable } from '../components/partner-declarations-table';

export const PartnerStatisticsPage: FC = () => {
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const [branchId, setBranchId] = useState<number | undefined>(undefined);
  const [startDate, endDate] = dates;

  const branchPartners = useBranchPartners();

  const { data, isFetching } = usePartnerDeclarationStatistics({
    startDate: startDate?.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: endDate?.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    branchId,
  });

  const onDateChange = useCallback((value: any) => { if (value) setDates(value); }, []);

  const inputs = useMemo(
    () => (
      <Space size={8}>
        <DatePicker.RangePicker onChange={onDateChange} allowClear={false} value={dates} />
        <Select
          disabled={branchPartners.isLoading}
          loading={branchPartners.isLoading}
          placeholder='Filial seçin'
          style={{ width: 200 }}
          value={branchId}
          onChange={(v) => setBranchId(v)}
          showSearch
          filterOption={(input, option) => String(option?.children || '').toLowerCase().includes(input.toLowerCase())}
        >
          {(branchPartners.data || []).map((b) => (
            <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
          ))}
        </Select>
      </Space>
    ),
    [dates, onDateChange, branchId, branchPartners],
  );

  if (isFetching) {
    return <PageContent title='Yerli anbar statistikası' extra={inputs}><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
  }

  if (!data?.data.length) {
    return <PageContent title='Yerli anbar statistikası' extra={inputs}><Empty description='Məlumat yoxdur...' /></PageContent>;
  }

  return (
    <PageContent title='Yerli anbar statistikası' extra={inputs}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
          <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
          <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
        </Radio.Group>
        <Button.Group>
          <Button>{data.total.count} ədəd</Button>
        </Button.Group>
      </div>
      {view === 'chart' && <PartnerDeclarationsChart data={data.data} />}
      {view === 'table' && <PartnerDeclarationsTable data={data.data} />}
    </PageContent>
  );
};
