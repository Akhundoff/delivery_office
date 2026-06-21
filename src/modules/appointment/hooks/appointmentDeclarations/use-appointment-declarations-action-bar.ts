import { useCallback, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { TinyDeclarationsTableContext } from '@modules/declarations/context';
import { AppointmentService } from '../../services';

export const useAppointmentDeclarationsActionBar = () => {
  const navigate = useNavigate();
  const { state, handleSelectAll, handleResetSelection } = useContext(TinyDeclarationsTableContext);

  const selectedIds = useMemo(
    () =>
      Object.entries(state.selectedRowIds)
        .filter(([, v]) => v)
        .map(([id]) => id),
    [state.selectedRowIds],
  );

  const selectionCount = selectedIds.length;

  const isReceiptVisible = useMemo(() => {
    if (!selectionCount) return false;
    return selectedIds.every((id) => {
      const row = state.data.find((item: any) => item.id.toString() === id);
      return row?.status?.id === 10;
    });
  }, [selectedIds, state.data, selectionCount]);

  const totalPrice = useMemo(() => {
    const rows = state.data.filter((item: any) => selectedIds.includes(item.id.toString()));
    const usd = rows.reduce((acc: number, item: any) => acc + (item.deliveryPrice || 0), 0);
    const azn = Math.round(usd * 1.7 * 100) / 100;
    return { usd: usd.toFixed(2), azn: azn.toFixed(2) };
  }, [selectedIds, state.data]);

  const totalWeight = useMemo(() => {
    const rows = state.data.filter((item: any) => selectedIds.includes(item.id.toString()));
    return rows.reduce((acc: number, item: any) => acc + (item.weight || 0), 0);
  }, [selectedIds, state.data]);

  const handoverDeclarations = useCallback(() => {
    navigate(`/declarations/${selectedIds.join(',')}/handover`);
  }, [navigate, selectedIds]);

  const handoverDeliverReceipt = useCallback(async () => {
    const result = await AppointmentService.getHandoverDeliveryReceipt(selectedIds);
    if (result.status === 200) {
      const win = window.open('', '_blank');
      win?.document.write(result.data as string);
      win?.document.close();
    } else {
      message.error(result.data as string);
    }
  }, [selectedIds]);

  return {
    selectedIds,
    selectionCount,
    handleSelectAll,
    handleResetSelection,
    handoverDeclarations,
    isReceiptVisible,
    totalPrice,
    totalWeight,
    handoverDeliverReceipt,
  };
};
