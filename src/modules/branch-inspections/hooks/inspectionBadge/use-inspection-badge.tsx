import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { MeContext } from '@modules/me/context/context';
import { useCounter } from '@modules/counter';
import { useNotification } from '@modules/notifications';
import { Constants } from '@shared/constants';
import { useBranchInspectionById } from '../branchInspections';

interface UseInspectionBadgeReturn {
  shouldShowBadge: boolean;
  inspectionId: number | null;
  userBranchId: number | null | undefined;
}

const renderInspectionDescription = ({
  branchName,
  note,
  deadlineFormatted,
  deadlineLeft,
  goToInspectionPage,
}: {
  branchName?: string;
  note?: string;
  deadlineFormatted?: string | null;
  deadlineLeft?: string | null;
  goToInspectionPage: (e: React.MouseEvent) => void;
}) => (
  <Space direction='vertical' size={8} style={{ width: '100%' }}>
    <Typography.Paragraph strong>{branchName ? `${branchName} filialı üçün yeni yoxlanış yaradılıb.` : 'Filialınız üçün yeni yoxlanış yaradılıb.'}</Typography.Paragraph>

    <Card size='small' bordered={false} style={{ background: '#fafafa', borderRadius: 8 }} bodyStyle={{ padding: 8 }}>
      {note ? (
        <Typography.Text>
          <Typography.Text strong>Qeyd:</Typography.Text> {note}
        </Typography.Text>
      ) : (
        <Typography.Text type='secondary'>Filialdakı bütün bağlamaları yoxlanışa scan etməyiniz tövsiyə olunur.</Typography.Text>
      )}
    </Card>

    <Typography.Paragraph style={{ marginTop: 8, color: '#fa8c16' }}>
      <Icons.ClockCircleOutlined /> <strong>Son tarix:</strong>{' '}
      {deadlineFormatted ? (
        <Tag color='orange'>
          {deadlineFormatted}
          {deadlineLeft && ` (${deadlineLeft})`}
        </Tag>
      ) : (
        'Qeyd edilməyib'
      )}
    </Typography.Paragraph>
    <Typography.Paragraph>
      <Typography.Link onClick={goToInspectionPage} style={{ color: '#1890ff', fontWeight: 500 }}>
        Filial yoxlanışları bölməsinə keç →
      </Typography.Link>
    </Typography.Paragraph>
  </Space>
);

export const useInspectionBadge = (): UseInspectionBadgeReturn => {
  const { state, can } = useContext(MeContext);
  const { state: counter } = useCounter();
  const notification = useNotification();
  const navigate = useNavigate();

  const userBranchId = state.user.data?.adminBranchId;

  const inspectionId = useMemo(() => {
    if (!userBranchId || !counter.byBranch) return null;
    const inspectionIdFromCounter = counter.byBranch[userBranchId]?.inspection;
    return inspectionIdFromCounter && inspectionIdFromCounter > 0 ? inspectionIdFromCounter : null;
  }, [userBranchId, counter.byBranch]);

  const shouldShowBadge = !!inspectionId;

  const { data: activeInspection, isLoading: isInspectionLoading } = useBranchInspectionById(inspectionId?.toString() || undefined);

  const goToInspectionPage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigate('/branch-inspections');
      notification.destroy();
    },
    [navigate, notification],
  );

  useEffect(() => {
    if (!shouldShowBadge || !userBranchId || !inspectionId || isInspectionLoading) return;

    const localStorageKey = `branch_inspection_notification_shown_${inspectionId}`;
    const notificationShown = localStorage.getItem(localStorageKey);

    if (notificationShown || !can('parcel_sorting_list')) return;

    const deadlineValue = activeInspection?.deadline?.value;
    const deadlineLeft = activeInspection?.deadline?.left;

    const deadlineFormatted = deadlineValue ? dayjs(deadlineValue).format(Constants.DATE_TIME_DOT) : null;

    const branchName = activeInspection?.branch?.name;
    const note = activeInspection?.note;

    notification.warning({
      message: 'Filial Yoxlanışı Xəbərdarlığı',
      description: renderInspectionDescription({ branchName, note, deadlineFormatted, deadlineLeft, goToInspectionPage }),
      placement: 'bottomRight',
      duration: 0,
      onClose: () => {},
      icon: <Icons.WarningOutlined style={{ color: '#faad14' }} />,
    });

    localStorage.setItem(localStorageKey, 'true');
  }, [shouldShowBadge, goToInspectionPage, userBranchId, can, inspectionId, activeInspection, counter.byBranch, isInspectionLoading, notification]);

  useEffect(() => {
    if (shouldShowBadge || !userBranchId) return;
    if (counter.byBranch?.[userBranchId]?.inspection !== 0) return;

    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('branch_inspection_notification_shown_')) {
        localStorage.removeItem(key);
      }
    });
  }, [shouldShowBadge, userBranchId, counter.byBranch]);

  return {
    shouldShowBadge,
    inspectionId,
    userBranchId,
  };
};
