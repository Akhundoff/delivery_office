import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InputRef, Modal, message } from 'antd';
import { useQuery } from 'react-query';
import { DeclarationsService } from '../../services';
import { BoxesService } from '@modules/boxes/services';

interface Barcode {
  barcode: string;
  branchName?: string;
  flightName?: string;
  requiresDeclaration?: boolean;
}

export const useBoxAcceptance = () => {
  const barcodeInputRef = useRef<InputRef>(null);
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const [barcodeMap, setBarcodeMap] = useState<Record<string, boolean>>({});
  const [type, setType] = useState<'acceptance' | 'transfer'>('acceptance');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myBox = useQuery(
    ['boxes', 'my'],
    async () => {
      const result = await BoxesService.getMyBox();
      if (result.status === 200) return result.data;
      return null;
    },
    { refetchInterval: 10000 },
  );

  const boxes = useQuery(
    ['boxes', 'list'],
    async () => {
      const result = await BoxesService.getList({ per_page: 1000 });
      return result.status === 200 ? result.data.data : [];
    },
    { staleTime: 5 * 60 * 1000 },
  );

  useEffect(() => {
    try {
      setBarcodes(JSON.parse(localStorage.getItem('boxAcceptance.barcodes') || '[]'));
      setBarcodeMap(JSON.parse(localStorage.getItem('boxAcceptance.barcodeMap') || '{}'));
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('boxAcceptance.barcodes', JSON.stringify(barcodes));
    localStorage.setItem('boxAcceptance.barcodeMap', JSON.stringify(barcodeMap));
  }, [barcodes, barcodeMap]);

  const isRequiredDeclarationExist = useMemo(() => Object.values(barcodeMap).some(Boolean), [barcodeMap]);

  const tableData = useMemo(
    () => barcodes.map((b, idx) => ({ id: idx + 1, barcode: b.barcode, branchName: b.branchName, flightName: b.flightName, requiresDeclaration: !!barcodeMap[b.barcode] })),
    [barcodes, barcodeMap],
  );

  const handleBarcodeSearch = useCallback(
    async (value: string) => {
      if (!value.trim()) return;
      const trackCode = value.trim().replace(/\D/g, '') || value.trim();

      const alreadyAdded = barcodes.some((b) => b.barcode === trackCode);
      if (alreadyAdded) {
        Modal.confirm({
          title: 'Diqqət',
          content: 'Bu bağlama artıq əlavə edilib',
          okText: 'Aydındır',
          okCancel: false,
          onOk: () => barcodeInputRef.current?.focus(),
        });
        return;
      }

      const result = await DeclarationsService.getDeclarationByTrackCode({ trackCode });
      if (result.status !== 200) {
        message.error(result.data as string);
        return;
      }

      const d = result.data;
      const barcode: Barcode = { barcode: d.trackCode, branchName: d.branch?.name, flightName: d.flight?.name };

      if (type === 'transfer') {
        setBarcodes((prev) => [barcode, ...prev]);
        barcodeInputRef.current?.focus();
        return;
      }

      if (d.requiresDeclaration) {
        setBarcodes((prev) => [barcode, ...prev]);
        setBarcodeMap((prev) => ({ ...prev, [barcode.barcode]: true }));
        message.warning('Bəyansız bağlama yeşiyə əlavə edilə bilməz.');
        barcodeInputRef.current?.focus();
        return;
      }

      if (!d.isYourBranch || !d.canAccommodate) {
        Modal.confirm({
          title: 'Diqqət',
          content: !d.isYourBranch ? `Bu bağlama başqa filiala aiddir. Əlavə edilsin?` : 'Bu bağlama artıq yerli anbarda olub. Yenidən əlavə etmək istəyirsinizmi?',
          onOk: () => {
            setBarcodes((prev) => [barcode, ...prev]);
            barcodeInputRef.current?.focus();
          },
          onCancel: () => barcodeInputRef.current?.focus(),
        });
        return;
      }

      setBarcodes((prev) => [barcode, ...prev]);
      barcodeInputRef.current?.focus();
    },
    [barcodes, type],
  );

  const removeBarcode = useCallback((index: number) => {
    setBarcodes((prev) => {
      const removed = prev[index - 1];
      if (removed) {
        setBarcodeMap((m) => {
          const updated = { ...m };
          delete updated[removed.barcode];
          return updated;
        });
      }
      return prev.filter((_, i) => i !== index - 1);
    });
  }, []);

  const resetBarcodes = useCallback(() => {
    setBarcodes([]);
    setBarcodeMap({});
  }, []);

  const handleCloseBox = useCallback(
    async (containerId?: string | number) => {
      if (isRequiredDeclarationExist && !containerId) {
        message.warning('Bəyansız bağlamalar var. Alternativ yeşik seçin.');
        return;
      }
      setIsSubmitting(true);
      const trackCodes = barcodes.map((b) => b.barcode);
      const result = await BoxesService.closeBox(trackCodes, containerId);
      setIsSubmitting(false);
      if (result.status === 200) {
        message.success('Yeşik bağlandı.');
        resetBarcodes();
        void myBox.refetch();
      } else {
        message.error(typeof result.data === 'string' ? result.data : 'Xəta baş verdi');
      }
    },
    [barcodes, isRequiredDeclarationExist, myBox, resetBarcodes],
  );

  const handleTransferBox = useCallback(async () => {
    setIsSubmitting(true);
    const result = await BoxesService.transferBox(barcodes.map((b) => b.barcode));
    setIsSubmitting(false);
    if (result.status === 200) {
      message.success('Transfer tamamlandı.');
      resetBarcodes();
    } else {
      message.error(result.data as string);
    }
  }, [barcodes, resetBarcodes]);

  const handleSelectBox = useCallback(
    async (containerId: string | number) => {
      const result = await BoxesService.selectBox(containerId);
      if (result.status === 200) {
        void myBox.refetch();
      } else {
        message.error(result.data as string);
      }
    },
    [myBox],
  );

  return {
    myBox,
    boxes,
    barcodeInputRef,
    tableData,
    barcodes,
    type,
    setType,
    isSubmitting,
    isRequiredDeclarationExist,
    handleBarcodeSearch,
    removeBarcode,
    resetBarcodes,
    handleCloseBox,
    handleTransferBox,
    handleSelectBox,
  };
};
