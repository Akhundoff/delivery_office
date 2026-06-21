import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { useContext } from 'react';
import { StyledHeaderButton } from '@modules/layout/styled';
import { MeContext } from '@modules/me';
import { useAppointmentDeclarationsActionBar } from '../hooks';

export const AppointmentDeclarationsActionBar = () => {
  const { can } = useContext(MeContext);
  const { selectionCount, selectedIds, handleSelectAll, handleResetSelection, handoverDeclarations, isReceiptVisible, totalPrice, totalWeight, handoverDeliverReceipt } =
    useAppointmentDeclarationsActionBar();

  return (
    <Space style={{ backgroundColor: '#1e2a31', width: '100%' }} size={0}>
      {!selectionCount ? (
        <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
          Hamısını seç
        </StyledHeaderButton>
      ) : (
        <StyledHeaderButton type="text" onClick={handleResetSelection} icon={<Icons.CloseCircleOutlined />}>
          {selectionCount} sətir | Çatdırılma: ${totalPrice.usd} (₼{totalPrice.azn}) | Çəki: {totalWeight.toFixed(2)}
        </StyledHeaderButton>
      )}
      {can('declarations_handover') && (
        <StyledHeaderButton type="text" disabled={!selectionCount} onClick={handoverDeclarations} icon={<Icons.CheckCircleOutlined />}>
          Təhvil ver
        </StyledHeaderButton>
      )}
      {isReceiptVisible && (
        <StyledHeaderButton type="text" onClick={handoverDeliverReceipt} icon={<Icons.FileTextOutlined />}>
          Təhvil sənədi
        </StyledHeaderButton>
      )}
    </Space>
  );
};
