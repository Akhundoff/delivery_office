import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InputRef, Modal, message } from 'antd';
import { useLocation } from 'react-router-dom';
import { useBranches } from '@modules/branches';
import { useBackgroundNavigate } from '@shared/hooks';
import { useSelectFlights } from './use-select-flights';
import { SortingService } from '../../services';
import { ITransferBarcode } from '../../interfaces';

export const parcelTypeOptions = [
  { value: 1, label: 'Daxili bağlama' },
  { value: 2, label: 'United bağlaması' },
  { value: 3, label: 'Partnyor bağlaması' },
];

export const useBranchTransferAcceptance = () => {
  const navigate = useBackgroundNavigate();
  const location = useLocation();
  const stateId = (location.state as { id?: number | string } | null)?.id;

  const branches = useBranches();
  const flights = useSelectFlights();

  const branchOptions = useMemo(() => branches.data?.map((b) => ({ label: b.name, value: b.id.toString() })) || [], [branches.data]);
  const flightOptions = useMemo(() => flights.data?.map((f) => ({ label: f.name, value: f.id.toString() })) || [], [flights.data]);

  const barcodeInputRef = useRef<InputRef>(null);

  const [parcelSortingId, setParcelSortingId] = useState<number | undefined>(stateId ? Number(stateId) : undefined);
  const [disabled, setDisabled] = useState(!stateId);
  const [checkDisabled, setCheckDisabled] = useState(!stateId);
  const [parcelTypeId, setParcelTypeId] = useState<number | undefined>();
  const [branchId, setBranchId] = useState<string | undefined>();
  const [flightIds, setFlightIds] = useState<string[]>([]);
  const [selectDisabled, setSelectDisabled] = useState(!!stateId);
  const [barcodes, setBarcodes] = useState<ITransferBarcode[]>([]);

  useEffect(() => {
    if (!stateId) return;
    (async () => {
      const result = await SortingService.getTransferInfo(stateId);
      if (result.status === 200) {
        setBranchId(result.data.branch?.id?.toString());
        setFlightIds(result.data.flights.map((f) => f.flightId.toString()));
      }
    })();
  }, [stateId]);

  const tableData = useMemo(() => barcodes.map((b, index) => ({ id: index + 1, barcode: b.barcode, parcel_sorting_id: b.parcel_sorting_id, checked: b.checked })), [barcodes]);

  const openSortingInfo = useCallback(() => {
    if (!parcelSortingId) return;
    navigate(`/sorting/${parcelSortingId}/info`);
  }, [navigate, parcelSortingId]);

  const onCreateTransfer = useCallback(async () => {
    if (!branchId) {
      message.warning('Filial seçilməyib...');
      return;
    }
    message.loading({ key: 'st-create', content: 'Əməliyyat aparılır...', duration: 0 });
    const result = await SortingService.create(branchId, flightIds);
    if (result.status === 200) {
      setParcelSortingId(result.data.id);
      setSelectDisabled(true);
      setDisabled(false);
      setCheckDisabled(false);
      message.success({ key: 'st-create', content: result.data.message });
      navigate('/sorting/acceptance', { state: { id: result.data.id }, replace: true });
    } else {
      message.error({ key: 'st-create', content: result.data as string });
    }
  }, [branchId, flightIds, navigate]);

  const onBarcodeSearch = useCallback(
    async (value: string) => {
      if (!value) return;
      if (barcodes.some((b) => b.barcode?.toString() === value)) {
        Modal.confirm({ title: 'Diqqət', content: 'Bu bağlama artıq əlavə edilib', okText: 'Aydındır', okCancel: false, onOk: () => barcodeInputRef.current?.focus() });
        return;
      }
      if (!parcelTypeId) {
        message.warning('Koli növü seçilməyib...');
        return;
      }
      if (!parcelSortingId) {
        message.warning('Filial göndərişi mövcud deyil...');
        return;
      }
      message.loading({ key: 'st-scan', content: 'Əməliyyat aparılır...', duration: 0 });
      const result = await SortingService.addToTransfer(parcelSortingId, value, parcelTypeId);
      if (result.status === 200) {
        message.destroy('st-scan');
        setDisabled(false);
        setBarcodes((prev) => [{ barcode: value, parcel_sorting_id: parcelSortingId, checked: result.data.isThisFlight }, ...prev]);
        barcodeInputRef.current?.focus();
      } else {
        message.error({ key: 'st-scan', content: result.data as string });
      }
    },
    [parcelTypeId, barcodes, parcelSortingId],
  );

  const removeBarcode = useCallback(async (row: { barcode: string; parcel_sorting_id: number }) => {
    message.loading({ key: 'st-remove', content: 'Əməliyyat aparılır...', duration: 0 });
    const result = await SortingService.removeFromTransfer(row.parcel_sorting_id, row.barcode);
    if (result.status === 200) {
      message.success({ key: 'st-remove', content: result.data.message });
      setBarcodes((prev) => prev.filter((b) => b.barcode !== row.barcode));
    } else {
      message.error({ key: 'st-remove', content: result.data as string });
    }
  }, []);

  const resetBarcodes = useCallback(() => {
    if (!parcelSortingId) return;
    Modal.confirm({
      title: 'Diqqət',
      content: 'Transferdəki qəbul edilməmiş bağlamaları silməyə əminsinizmi?',
      onOk: async () => {
        message.loading({ key: 'st-truncate', content: 'Əməliyyat aparılır...', duration: 0 });
        const result = await SortingService.truncateTransfer(parcelSortingId);
        if (result.status === 200) {
          message.success({ key: 'st-truncate', content: result.data.message });
          setBarcodes([]);
          setParcelSortingId(undefined);
          setBranchId(undefined);
          setFlightIds([]);
          setSelectDisabled(false);
          navigate('/sorting/acceptance', { replace: true });
        } else {
          message.error({ key: 'st-truncate', content: result.data as string });
        }
      },
    });
  }, [parcelSortingId, navigate]);

  const lastBarcode = useMemo(() => barcodes[0], [barcodes]);

  return {
    barcodeInputRef,
    disabled,
    checkDisabled,
    onBarcodeSearch,
    lastBarcode,
    tableData,
    branchOptions,
    flightOptions,
    parcelTypeId,
    setParcelTypeId,
    branchId,
    setBranchId,
    flightIds,
    setFlightIds,
    onCreateTransfer,
    resetBarcodes,
    canClearBarcodes: !!barcodes.length,
    removeBarcode,
    selectDisabled,
    openSortingInfo,
    parcelTypeOptions,
  };
};
