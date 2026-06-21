import { FC, useContext, useState } from 'react';
import { Button, Descriptions, Popover, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';
import { tableFilterQueryMaker } from '@shared/modules/next-table/utils/query-maker';
import { CustomsDeclarationsTableContext } from '../context';
import { CustomsDeclarationsService } from '../services';

export const CustomsDeclarationsCounts: FC = () => {
  const { state } = useContext(CustomsDeclarationsTableContext);
  const [visible, setVisible] = useState(false);

  const filterQuery = tableFilterQueryMaker(state.filters);

  const { data, isLoading } = useQuery(['customs', 'declarations', 'counts', filterQuery], () => CustomsDeclarationsService.getCounts(filterQuery), { enabled: visible });

  const counts = data?.status === 200 ? data.data.counts : null;

  const content = isLoading ? (
    <Spin size="small" />
  ) : counts ? (
    <Descriptions column={1} size="small" bordered>
      <Descriptions.Item label="Bəyan edilmiş">{counts.declared}</Descriptions.Item>
      <Descriptions.Item label="Bəyan edilməmiş">{counts.undeclared}</Descriptions.Item>
      <Descriptions.Item label="Mövcud olmayan müştərilər">{counts.nonExistUsers}</Descriptions.Item>
    </Descriptions>
  ) : null;

  return (
    <Popover content={content} trigger="click" open={visible} onOpenChange={setVisible} title="Statistika">
      <Button type="text" icon={<Icons.InfoCircleOutlined />} />
    </Popover>
  );
};
