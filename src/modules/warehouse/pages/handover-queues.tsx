import { FC, Fragment, useContext } from 'react';
import { Button, Checkbox, Col, Result, Row, Space, Spin, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import uniq from 'lodash/uniq';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { MeContext } from '@modules/me';
import { HandoverItemCard, HandoverItemFooter, HandoverItemInfo } from '../components';
import { useHandoverQueues } from '../hooks';

export const HandoverQueuesPage: FC = () => {
  const navigate = useNavigate();
  const { can } = useContext(MeContext);
  const { data, isLoading, error, execute, remove, updateStatus, checkPrint, onChangeFilter } = useHandoverQueues();

  const header = (
    <HeadPortal>
      <StyledActionBar $flex>
        <Space>
          <StyledHeaderButton type="primary" onClick={() => navigate('/warehouse/handover/queues')} icon={<Icons.UnorderedListOutlined />}>
            Təhvil
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={() => navigate('/warehouse/handover/history')} icon={<Icons.HistoryOutlined />}>
            Tarixçə
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );

  if (isLoading) {
    return (
      <Fragment>
        {header}
        <Spin style={{ display: 'block', padding: '60px 0', textAlign: 'center' }} />
      </Fragment>
    );
  }

  if (error) {
    return (
      <Fragment>
        {header}
        <Result status="500" title={(error as Error).message} />
      </Fragment>
    );
  }

  if (!data || !data.data.length) {
    return (
      <Fragment>
        {header}
        <Result status="404" title="Növbədə gözləyən müştəri yoxdur." />
      </Fragment>
    );
  }

  return (
    <Fragment>
      {header}
      <div style={{ padding: '0 16px' }}>
        <Row gutter={[12, 12]} style={{ marginBottom: -6 }}>
          {data.data.map((item) => (
            <Col key={item.id} span={24} md={12} lg={8}>
              <HandoverItemCard
                title={`Növbə - #${item.id}`}
                extra={
                  <div>
                    {item.status.id === 41 && (
                      <Tag icon={<Icons.LoadingOutlined />} color="warning">
                        Gözləmədə
                      </Tag>
                    )}
                    {item.status.id === 42 && (
                      <Tag icon={<Icons.Loading3QuartersOutlined />} color="processing">
                        İcra edilir
                      </Tag>
                    )}
                  </div>
                }
              >
                <HandoverItemInfo size="small" column={1}>
                  <HandoverItemInfo.Item label="Müştəri kodu">{item.user.id}</HandoverItemInfo.Item>
                  <HandoverItemInfo.Item label="Müştəri adı">{item.user.fullName}</HandoverItemInfo.Item>
                  <HandoverItemInfo.Item label="Bağlama sayı">{item.declarations.length} ədəd</HandoverItemInfo.Item>
                  <HandoverItemInfo.Item label="Yeşiklər">{uniq(item.declarations.filter((d) => d.box).map((d) => d.box?.name)).join(', ') || 'Qeyd olunmayıb'}</HandoverItemInfo.Item>
                </HandoverItemInfo>
                {(can('local_warehouse_execute') || can('local_warehouse_delete')) && (
                  <HandoverItemFooter>
                    <Space size={4}>
                      <Checkbox style={{ marginRight: 10 }} checked={checkPrint} onChange={onChangeFilter}>
                        Çek çap edilsin
                      </Checkbox>
                      {can('local_warehouse_delete') && (
                        <Button onClick={() => remove.mutate({ queueId: item.id })} icon={<Icons.DeleteOutlined />} danger>
                          Ləğv et
                        </Button>
                      )}
                      {can('local_warehouse_execute') && item.status.id === 41 && (
                        <Button loading={updateStatus.isLoading} onClick={() => execute(item.id)} icon={<Icons.Loading3QuartersOutlined />} type="primary">
                          İcra edirəm
                        </Button>
                      )}
                    </Space>
                  </HandoverItemFooter>
                )}
              </HandoverItemCard>
            </Col>
          ))}
        </Row>
      </div>
    </Fragment>
  );
};
