import { FC, Fragment, useMemo, useState } from 'react';
import { Card, Col, Descriptions, Menu, Result, Row, Spin, Statistic } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledActionBar } from '@shared/styled/action-bar';
import { UsersService } from '@modules/users/services';
import { UserDescriptions } from '../components';
import { DeclarationsAppointmentTable, OrdersAppointmentTable, CouriersAppointmentTable, CustomsDeclarationsAppointmentTable, TransactionsAppointmentTable } from '../containers';

type AppointmentSection = 'declarations' | 'orders' | 'couriers' | 'transactions' | 'customsDeclarations';

export const AppointmentPage: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [section, setSection] = useState<AppointmentSection>('declarations');

  const { data: userResult, isLoading } = useQuery(['users', userId], () => UsersService.getUserById(userId!), { enabled: !!userId });

  const user = userResult?.status === 200 ? userResult.data : null;

  const defaultTableState = useMemo(
    () => ({
      filters: [{ id: 'user_id', value: userId }],
      hiddenColumns: ['user_id', 'user_name'],
    }),
    [userId],
  );

  if (isLoading) return <Spin size="large" style={{ display: 'block', padding: 40 }} />;
  if (!user) return <Result status="404" title="İstifadəçi tapılmadı." />;

  return (
    <PageContent title={`#${user.id} - ${user.fullName}`}>
      <HeadPortal>
        <StyledActionBar $flex>
          <Menu selectedKeys={[section]} onSelect={({ key }) => setSection(key as AppointmentSection)} mode="horizontal" style={{ background: 'transparent', border: 'none' }}>
            <Menu.Item key="declarations">Bağlamalar</Menu.Item>
            <Menu.Item key="orders">Sifarişlər</Menu.Item>
            <Menu.Item key="couriers">Kuryerlər</Menu.Item>
            <Menu.Item key="transactions">Balans əməliyyatları</Menu.Item>
            <Menu.Item key="customsDeclarations">Bəyannamələr</Menu.Item>
          </Menu>
        </StyledActionBar>
      </HeadPortal>
      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={24} lg={8} xl={3}>
          <Card size="small" bodyStyle={{ paddingTop: 3, paddingBottom: 2 }}>
            <Statistic title="Balans" value={user.balance.usd} prefix="$" precision={2} />
          </Card>
        </Col>
        <Col span={24} lg={8} xl={3}>
          <Card size="small" bodyStyle={{ paddingTop: 3, paddingBottom: 2 }}>
            <Statistic title="Balans" value={user.balance.try} prefix="₺" precision={2} />
          </Card>
        </Col>
        <Col span={24} lg={8} xl={3}>
          <Card size="small" bodyStyle={{ paddingTop: 3, paddingBottom: 2 }}>
            <Statistic title="Borc" value={user.debt.try} prefix="₺" precision={2} />
          </Card>
        </Col>
        <Col span={24} lg={24} xl={15}>
          <UserDescriptions layout="vertical" column={4}>
            <Descriptions.Item label="Ş.V Nömrəsi">{user.passport.number || '—'}</Descriptions.Item>
            <Descriptions.Item label="FİN Kod">{user.passport.secret || '—'}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Telefon">{user.phoneNumber || '—'}</Descriptions.Item>
          </UserDescriptions>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {section === 'declarations' && (
            <Fragment>
              <DeclarationsAppointmentTable userId={userId!} />
            </Fragment>
          )}
          <Col span={24}>{section === 'orders' && <OrdersAppointmentTable userId={userId!} />}</Col>
          <Col span={24}>{section === 'couriers' && <CouriersAppointmentTable userId={userId!} />}</Col>
          <Col span={24}>{section === 'transactions' && <TransactionsAppointmentTable userId={userId!} />}</Col>
          <Col span={24}>{section === 'customsDeclarations' && <CustomsDeclarationsAppointmentTable userId={userId!} />}</Col>
        </Col>
      </Row>
    </PageContent>
  );
};
