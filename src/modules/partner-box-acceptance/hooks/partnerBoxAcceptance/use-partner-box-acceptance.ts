import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, Modal, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useContext } from 'react';
import { MeContext } from '@modules/me/context/context';
import { usePartnerBoxes } from '@modules/partner-boxes';
import { PartnerBoxAcceptanceService } from '../../services';
import { IAcceptanceBarcode } from '../../interfaces';

export const usePartnerBoxAcceptance = () => {
  const { state } = useContext(MeContext);
  const queryClient = useQueryClient();
  const partnerBoxes = usePartnerBoxes();

  const myPartnerBox = useQuery(['my-partner-box'], async () => {
    const result = await PartnerBoxAcceptanceService.getMyBox();
    if (result.status === 200) return result.data;
    throw new Error(result.data as string);
  }, { refetchInterval: 10000 });

  const selectBoxMutation = useMutation(async (id: string | number) => {
    const result = await PartnerBoxAcceptanceService.selectBox(id);
    if (result.status !== 200) throw new Error(result.data as string);
    await queryClient.invalidateQueries(['my-partner-box']);
  });

  const barcodeInputRef = useRef<any>(null);
  const [disabled, setDisabled] = useState(false);
  const [barcodeType, setBarcodeType] = useState(false);
  const [barcodes, setBarcodes] = useState<IAcceptanceBarcode[]>([]);
  const [barcodeMap, setBarcodeMap] = useState<Record<string, boolean>>({});
  const [duplicatedTrackCodes, setDuplicatedTrackCodes] = useState<string[]>([]);
  const [boxId, setBoxId] = useState('');
  const [isBoxSelectVisible, setIsBoxSelectVisible] = useState(false);
  const [closeError, setCloseError] = useState<{ message: string; failedBarcodeIndexes: number[] } | null>(null);

  const branchId = useMemo(() => state.user.data ? undefined : undefined, [state.user.data]);

  const tableData = useMemo(
    () =>
      barcodes.map((b, i) => ({
        id: i + 1,
        barcode: b.barcode,
        branch_name: b.branch_name,
        flight_name: b.flight_name,
        requires_declaration: !!barcodeMap[b.barcode],
      })),
    [barcodes, barcodeMap],
  );

  const isRequiredDeclarationExist = useMemo(() => tableData.some((r) => r.requires_declaration), [tableData]);

  const closeBoxMutation = useMutation(
    async ({ trackCodes, containerId }: { trackCodes: string[]; containerId: string }) => {
      const result = await PartnerBoxAcceptanceService.closeBox(trackCodes, containerId);
      if (result.status === 200) return { errors: null };
      if (result.status === 422) return { errors: result.data as Record<string, string[]> };
      throw new Error(result.data as string);
    },
    {
      onSuccess: (data) => {
        if (data?.errors) {
          const errors = data.errors;
          const failedBarcodeIndexes = Object.keys(errors)
            .filter((k) => /^track_code\.\d+$/.test(k))
            .map((k) => parseInt(k.split('.')[1]));

          const msg = Object.entries(errors)
            .filter(([k]) => /^track_code\.\d+$/.test(k))
            .flatMap(([k, v]) => {
              const idx = parseInt(k.split('.')[1]);
              return (v as string[]).map((m) => m.replace(`seçilmiş track_code.${idx}`, barcodes[idx]?.barcode || ''));
            })
            .filter(Boolean)
            .join('. ');

          const fallbackMsg = Object.values(errors).flat().join('. ');
          setCloseError({ message: msg || fallbackMsg, failedBarcodeIndexes });
          message.error(msg || fallbackMsg);
          return;
        }

        setBarcodes([]);
        setBarcodeMap({});
        setDuplicatedTrackCodes([]);
        setBoxId('');
        setCloseError(null);
        queryClient.invalidateQueries(['my-partner-box']);
        message.success('Əməliyyat müvəffəqiyyətlə başa çatdı.');
      },
      onError: (err: Error) => {
        setCloseError({ message: err.message, failedBarcodeIndexes: [] });
        message.error(err.message);
      },
    },
  );

  const resetBarcodes = useCallback(() => {
    setBarcodes([]);
    setBarcodeMap({});
    setDuplicatedTrackCodes([]);
    setCloseError(null);
  }, []);

  const removeBarcode = useCallback(
    (index: number) => {
      const barcode = barcodes[index];
      setBarcodes((prev) => prev.filter((_, i) => i !== index));
      if (barcode) {
        setDuplicatedTrackCodes((prev) => prev.filter((tc) => tc !== barcode.barcode));
        setBarcodeMap((prev) => {
          const next = { ...prev };
          delete next[barcode.barcode];
          return next;
        });
      }
    },
    [barcodes],
  );

  const onSelectBoxId = useCallback((value: string) => setBoxId(value), []);
  const onCloseBoxSelect = useCallback(() => setIsBoxSelectVisible(false), []);

  const onBarcodeSearch = useCallback(async (value: string) => {
    if (!value) return;

    const trackCode = barcodeType ? value : value.replace(/\D/g, '');
    const trendyol = barcodeType ? '1' : '0';

    const isDuplicate = barcodes.some((b) => b.barcode === trackCode);
    if (isDuplicate) {
      Modal.confirm({
        title: 'Diqqət',
        content: 'Yeşikdə olan məhsul aşkarlandı.',
        okText: 'Aydındır',
        okCancel: false,
        onOk: () => {
          setDisabled(false);
          barcodeInputRef.current?.setValue?.('');
          barcodeInputRef.current?.focus?.();
        },
      });
      return;
    }

    const result = await PartnerBoxAcceptanceService.getDeclarationByTrackCode({ trackCode, acceptance: true, trendyol });
    if (result.status !== 200) {
      message.error(result.data);
      return;
    }

    const decl = result.data;
    const barcode: IAcceptanceBarcode = {
      barcode: decl.trackCode,
      branch_name: decl.branch?.name,
      flight_name: decl.flight?.name,
    };

    if (decl.requiresDeclaration) {
      setBarcodes((prev) => [barcode, ...prev]);
      setBarcodeMap((prev) => ({ ...prev, [barcode.barcode]: true }));
      Modal.confirm({
        title: 'Diqqət Bəyansız Bağlama!',
        content: 'Bəyansız bağlama bu yeşiyə əlavə edilə bilməz.',
        okButtonProps: { hidden: true },
        okCancel: false,
      });
      setTimeout(() => {
        Modal.destroyAll();
        barcodeInputRef.current?.setValue?.('');
        barcodeInputRef.current?.focus?.();
      }, 1000);
      return;
    }

    if (!decl.isYourBranch || !decl.canAccommodate) {
      Modal.confirm({
        title: 'Diqqət',
        content: !decl.isYourBranch
          ? `Bu bağlama ${decl.locationName} aiddir. Əlavə edilsin?`
          : 'Bu bağlama yerli anbarda olub. Yenidən əlavə etmək istəyinizdən əminsinizmi?',
        onOk: () => {
          setBarcodes((prev) => [barcode, ...prev]);
          setDisabled(false);
          barcodeInputRef.current?.setValue?.('');
        },
        onCancel: () => {
          setDisabled(false);
          barcodeInputRef.current?.setValue?.('');
          barcodeInputRef.current?.focus?.();
        },
      });
      return;
    }

    setBarcodes((prev) => [barcode, ...prev]);
    barcodeInputRef.current?.setValue?.('');
  }, [barcodes, barcodeType]);

  const onOpenBoxSelect = useCallback(() => setIsBoxSelectVisible(true), []);

  const onClosePartnerBox = useCallback(() => {
    if (isRequiredDeclarationExist && !boxId) {
      onOpenBoxSelect();
      return;
    }

    const mutation = () => {
      closeBoxMutation.mutate({ trackCodes: barcodes.map((b) => b.barcode), containerId: boxId });
    };

    if (duplicatedTrackCodes.length) {
      Modal.confirm({
        title: 'Diqqət',
        content: `${duplicatedTrackCodes.length} ədəd təkrar izləmə kodu aşkarlandır. Əməliyyatı davam etməyə əminsinizmi?`,
        onOk: mutation,
      });
    } else {
      mutation();
    }
  }, [barcodes, boxId, closeBoxMutation, duplicatedTrackCodes.length, isRequiredDeclarationExist, onOpenBoxSelect]);

  const onSelectPartnerBox = useCallback((value: string | number) => {
    selectBoxMutation.mutate(value, {
      onError: (err: any) => { message.error(err.message); },
    });
  }, [selectBoxMutation]);

  const onBarcodeTypeSwitch = useCallback(() => setBarcodeType((t) => !t), []);

  useEffect(() => {
    const savedBarcodes = localStorage.getItem('partnerBoxAcceptance.barcodes');
    const savedMap = localStorage.getItem('partnerBoxAcceptance.barcodeMap');
    if (savedBarcodes) setBarcodes(JSON.parse(savedBarcodes));
    if (savedMap) setBarcodeMap(JSON.parse(savedMap));
  }, []);

  useEffect(() => {
    localStorage.setItem('partnerBoxAcceptance.barcodes', JSON.stringify(barcodes));
    localStorage.setItem('partnerBoxAcceptance.barcodeMap', JSON.stringify(barcodeMap));
  }, [barcodes, barcodeMap]);

  return {
    partnerBoxes,
    myPartnerBox,
    selectBoxMutation,
    closeBoxMutation,
    closeError,
    resetBarcodes,
    onClosePartnerBox,
    onSelectPartnerBox,
    onBarcodeSearch,
    tableData,
    barcodes,
    disabled,
    removeBarcode,
    duplicatedTrackCodes,
    canClearBarcodes: barcodes.length > 0,
    barcodeType,
    onBarcodeTypeSwitch,
    barcodeInputRef,
    isBoxSelectVisible,
    onSelectBoxId,
    onOpenBoxSelect,
    onCloseBoxSelect,
    lastBarcode: barcodes[0],
  };
};
