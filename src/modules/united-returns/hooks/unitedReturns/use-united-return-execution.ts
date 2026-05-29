import { useCallback, useMemo, useRef, useState } from 'react';
import { InputRef, Modal, message } from 'antd';
import { useQuery } from 'react-query';
import { UnitedReturnsService } from '../../services';
import { UnitedReturnStatusType } from '../../interfaces';

export const useUnitedReturnExecution = () => {
  const barcodeInputRef = useRef<InputRef>(null);
  const [disabled] = useState(false);
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [transferType, setTransferType] = useState(false);

  const { data, isFetching, refetch } = useQuery(
    ['united-returns-execution'],
    async () => {
      const result = await UnitedReturnsService.getList({ state_id: UnitedReturnStatusType.READY, per_page: 200 });
      if (result.status === 200) return result.data.data;
      throw new Error(result.data as string);
    },
    { staleTime: 0 },
  );

  const onBarcodeSearch = useCallback(
    async (value: string) => {
      if (!value.trim()) {
        message.warning('Barkod daxil edilməyib.');
        return;
      }

      if (barcodes.includes(value)) {
        Modal.confirm({
          title: 'Diqqət',
          content: 'Bu bağlama artıq əlavə edilib',
          okText: 'Aydındır',
          okCancel: false,
          onOk: () => {
            barcodeInputRef.current?.focus();
          },
        });
        return;
      }

      message.loading({ key: 'ur-scan', content: 'Əməliyyat aparılır...', duration: 0 });
      const result = await UnitedReturnsService.changeStatus(value, { stateId: UnitedReturnStatusType.READY, transfer: transferType ? '1' : '0' });
      if (result.status === 200) {
        message.success({ key: 'ur-scan', content: 'Status uğurla yeniləndi.' });
        setBarcodes((prev) => [value, ...prev]);
        refetch();
      } else {
        message.error({ key: 'ur-scan', content: result.data as string });
      }
    },
    [barcodes, transferType, refetch],
  );

  const onFinish = useCallback(async () => {
    message.loading({ key: 'ur-finish', content: 'Əməliyyat aparılır...', duration: 0 });
    const result = await UnitedReturnsService.finish();
    if (result.status === 200) {
      message.success({ key: 'ur-finish', content: 'Uğurla yeniləndi.' });
      refetch();
    } else {
      message.error({ key: 'ur-finish', content: result.data as string });
    }
  }, [refetch]);

  const lastBarcode = useMemo(() => barcodes[0], [barcodes]);

  const onTransferTypeSwitch = useCallback((value: boolean) => setTransferType(value), []);

  return { barcodeInputRef, disabled, onBarcodeSearch, lastBarcode, data: data || [], isFetching, onFinish, transferType, onTransferTypeSwitch };
};
