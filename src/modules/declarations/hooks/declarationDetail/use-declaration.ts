import { useCallback, useContext, useMemo, useState } from "react";
import { Form, message, Modal } from "antd";
import { useQuery } from "react-query";

import { useBackgroundNavigate } from "@shared/hooks";
import { MeContext } from "@modules/me";
import { useNotification } from "@modules/notifications";
import { StatusesService } from "@modules/statuses/services";
import { IStatus } from "@modules/statuses";
import { useDeclarationDetail } from "./use-declaration-detail";
import { usePrint } from "./use-print";
import { DeclarationsService } from "../../services";

export const customsStatesInfo = [
  { id: 0, label: "Karqo sirketi melumati elave edib" },
  { id: 1, label: "Vetendas elave edilmis baglamaya beyanname yazib" },
  { id: 2, label: "Baglamalar qutulara yigilib" },
  { id: 3, label: "Depesh request gonderilib" },
  { id: 60, label: "Dövlət xeyrinə imtina olundu" },
  { id: 70, label: "Gömrük orqanı tərəfindən saxlanıldı" },
  { id: 71, label: "Buraxılışı təmin edildi" },
  { id: 72, label: "Geri qaytarıldı" },
  { id: 73, label: "GB ilə buraxılsın" },
  { id: 100, label: "ETB ləğv edildi" },
];

export const useDeclaration = (id: string) => {
  const navigate = useBackgroundNavigate();
  const { can } = useContext(MeContext);
  const notification = useNotification();
  const detail = useDeclarationDetail(id);
  const { printWaybill, printProformaInvoice, printHandoverCheck } = usePrint(id);

  const data = detail.data;

  const orderIds = useQuery<string[], Error>(
    ["declarations", id, "orders"],
    async () => {
      const result = await DeclarationsService.getOrderIds(id);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id, initialData: [] },
  );

  const [isTogglingWanted, setIsTogglingWanted] = useState(false);
  const [wantedModalVisible, setWantedModalVisible] = useState(false);

  const [pinCodeEditing, setPinCodeEditing] = useState(false);
  const [form] = Form.useForm();

  const [isContainerTransfersModalVisible, setIsContainerTransfersModalVisible] = useState(false);
  const [customsStatusModalOpen, setCustomsStatusModalOpen] = useState(false);
  const [isCustomsRawModalOpen, setIsCustomsRawModalOpen] = useState(false);
  const [isDGKStatusEnabled, setIsDGKStatusEnabled] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const canHandover = data?.status.id !== 10;
  const waybillIsDisabled = !(data?.status?.id && data.status.id >= 7);

  const handover = useCallback(() => {
    navigate(`/declarations/${id}/handover`, {
      withBackground: true,
    });
  }, [id, navigate]);

  const returnDec = useCallback(() => {
    navigate(`/declarations/${id}/return`, { withBackground: true });
  }, [id, navigate]);

  const openEdit = useCallback(() => {
    navigate(`/declarations/${id}/update`, { withBackground: true });
  }, [id, navigate]);

  const openTimeline = useCallback(() => {
    navigate(`/declarations/${id}/timeline`, {
      withBackground: true,
    });
  }, [id, navigate]);

  const openOrder = useCallback(
    (orderId: string) => {
      navigate(`/orders/${orderId}`, { withBackground: true });
    },
    [navigate],
  );

  const remove = useCallback(() => {
    Modal.confirm({
      title: "Diqqət",
      content: "Bağlamanı silməyə əminsinizmi?",
      okText: "Sil",
      okType: "danger",
      cancelText: "Ləğv et",
      onOk: async () => {
        const result = await DeclarationsService.cancelDeclarations([id]);
        if (result.status === 200) {
          message.success("Bağlama silindi.");
          navigate("/declarations", { withBackground: false });
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [id, navigate]);

  const cancelDispatch = useCallback(() => {
    Modal.confirm({
      title: "Diqqət",
      content: "Depeshi ləğv etməyə əminsinizmi?",
      okText: "Ləğv et",
      cancelText: "İmtina",
      onOk: async () => {
        const result = await DeclarationsService.cancelDispatch(id);
        if (result.status === 200) {
          message.success("Depesh ləğv edildi.");
          detail.refetch();
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [id, detail]);

  const removeFromFlight = useCallback(() => {
    Modal.confirm({
      title: "Diqqət",
      content: "Bağlamanı uçuşdan silməyə əminsinizmi?",
      okText: "Sil",
      okType: "danger",
      cancelText: "İmtina",
      onOk: async () => {
        const result = await DeclarationsService.removeFromFlight(id);
        if (result.status === 200) {
          message.success("Bağlama uçuşdan çıxarıldı.");
          detail.refetch();
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [id, detail]);

  const handleRemoveFromContainer = useCallback(() => {
    Modal.confirm({
      title: "Diqqət",
      content: "Bağlamanı yeşikdən çıxarmağa razısınızmı?",
      okText: "Çıxar",
      okType: "danger",
      cancelText: "İmtina",
      onOk: async () => {
        const result = await DeclarationsService.removeFromContainer(id);
        if (result.status === 200) {
          message.success("Bağlama yeşikdən çıxarıldı.");
          detail.refetch();
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [id, detail]);

  const openWantedModal = useCallback(() => setWantedModalVisible(true), []);
  const closeWantedModal = useCallback(() => setWantedModalVisible(false), []);

  const handleToggleWantedStatus = useCallback(async () => {
    if (data?.isWanted) {
      setIsTogglingWanted(true);
      const result = await DeclarationsService.toggleWanted(id, null);
      setIsTogglingWanted(false);
      if (result.status === 200) {
        message.success(
          (result.data as any)?.message || "Əməliyyat uğurla tamamlandı",
        );
        detail.refetch();
      } else {
        message.error(result.data as string);
      }
    } else {
      openWantedModal();
    }
  }, [id, data?.isWanted, detail, openWantedModal]);

  const handleSubmitWanted = useCallback(
    async (descr: string | null) => {
      setIsTogglingWanted(true);
      const result = await DeclarationsService.toggleWanted(id, descr);
      setIsTogglingWanted(false);
      if (result.status === 200) {
        message.success(
          (result.data as any)?.message || "Əməliyyat uğurla tamamlandı",
        );
        closeWantedModal();
        detail.refetch();
      } else {
        message.error(result.data as string);
      }
    },
    [id, detail, closeWantedModal],
  );

  // --- Container transfers (Yeşik) modal ---
  const openContainerTransfersModal = useCallback(() => setIsContainerTransfersModalVisible(true), []);
  const closeContainerTransfersModal = useCallback(() => setIsContainerTransfersModalVisible(false), []);

  // --- DGK status accordion + modal ---
  const resetDGKStatus = useCallback(() => {
    setIsDGKStatusEnabled(false);
    setIsAccordionOpen(false);
  }, []);

  const customsStatus = useQuery(
    ["declarations", data?.trackCode, "customs", "status"],
    async () => {
      if (!data?.trackCode) throw new Error("Məlumatlar əldə edilə bilmədi");
      const result = await DeclarationsService.getCustomsStatus({ trackCode: data.trackCode });
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    {
      enabled: isDGKStatusEnabled && !!data?.trackCode,
      onSuccess: () => setIsAccordionOpen(true),
      onError: () => resetDGKStatus(),
    },
  );

  const handleAccordionChange = useCallback(
    (key: string | string[]) => {
      const opened = Array.isArray(key) ? key.length > 0 : !!key;
      if (opened) {
        if (!customsStatus.isSuccess) {
          setIsAccordionOpen(false);
          setIsDGKStatusEnabled(true);
        } else {
          setIsAccordionOpen(true);
        }
      } else {
        setIsAccordionOpen(false);
      }
    },
    [customsStatus.isSuccess],
  );

  const customStatusName = useMemo(() => {
    return customsStatesInfo.find((state) => state.id === customsStatus.data?.customsStatus)?.label || "";
  }, [customsStatus.data]);

  const openCustomsStatusModal = useCallback(() => setCustomsStatusModalOpen(true), []);
  const closeCustomsStatusModal = useCallback(() => setCustomsStatusModalOpen(false), []);

  const openCustomsRawModal = useCallback(() => setIsCustomsRawModalOpen(true), []);
  const closeCustomsRawModal = useCallback(() => setIsCustomsRawModalOpen(false), []);

  // --- United (Trendyol/Temu) parcel state changes ---
  const customsStatusName = useMemo(() => {
    switch (data?.trendyolLogs?.customsStatus) {
      case "Initial":
        return "SC göndərilməyib";
      case "Sent":
        return "SC göndərilib";
      case "Declared":
        return "Bəyan edilib";
      case "Boxed":
        return "Kolilənib";
      case "Depesh":
        return "Yola salınıb";
      default:
        return data?.trendyolLogs?.customsStatus;
    }
  }, [data?.trendyolLogs?.customsStatus]);

  const parcelStatesQuery = useQuery(
    ["declarations", data?.trackCode, "parcel-states"],
    async () => {
      if (!data?.trackCode) throw new Error("Məlumatlar əldə edilə bilmədi");
      const result = await DeclarationsService.getParcelStates({ trackCode: data.trackCode });
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!data?.trackCode && (data?.trendyol === 1 || data?.trendyol === 2) },
  );

  const trendyolStatus = useQuery<IStatus[], Error>(
    ["statuses", "model", 43],
    async () => {
      const result = await StatusesService.getList({ per_page: 500, model_id: 43 });
      if (result.status === 200) return result.data.data;
      throw new Error(result.data as string);
    },
    { enabled: data?.trendyol === 1, staleTime: 1000 * 60 * 15, initialData: [] },
  );

  const changeTrendyolStatus = useCallback(
    (statusId: string | number, statusName: string) => {
      Modal.confirm({
        title: "Diqqət",
        content: `Bağlamanın statusun "${statusName}" olaraq dəyişmək istədiyinizdən əminsinizmi?`,
        onOk: async () => {
          const hide = message.loading("Gözləyin...", 0);
          const result = await DeclarationsService.changeTrendyolStatus([id], statusId);
          hide();
          if (result.status === 200) {
            message.success("Status dəyişdirildi");
            parcelStatesQuery.refetch();
            detail.refetch();
          } else {
            message.error(result.data as string);
          }
        },
      });
    },
    [id, parcelStatesQuery, detail],
  );

  // --- FIN/pin code editing ---
  const onTogglePinCodeEditing = useCallback(() => setPinCodeEditing((prev) => !prev), []);

  const onPinCodeSubmit = useCallback(
    async (values: { pincode: string }, isTemu = false) => {
      const currentPincode = data?.trendyolLogs?.pinCode || "";
      if (values.pincode === currentPincode) {
        form.resetFields();
        setPinCodeEditing(false);
        return;
      }

      const hide = message.loading("FİN kod dəyişdirilir...", 0);
      const result = isTemu ? await DeclarationsService.changeTemuPincode(id, values) : await DeclarationsService.changePincode(id, values);
      hide();
      setPinCodeEditing(false);
      form.resetFields();

      if (result.status === 200) {
        message.success("Əməliyyat müvəffəqiyyətlə başa çatdı.");
        detail.refetch();
      } else {
        message.error((result.data as string) || "Xəta baş verdi.");
      }
    },
    [id, data, form, detail],
  );

  // --- Trendyol status change confirmation ---
  return {
    data,
    isLoading: detail.isLoading,
    error: detail.error?.message ?? null,
    orderUrls: orderIds,
    orderIds: orderIds.data ?? [],
    canHandover,
    can,
    notification,
    waybillIsDisabled,
    handover,
    returnDec,
    openEdit,
    openTimeline,
    openOrder,
    remove,
    cancelDispatch,
    removeFromFlight,
    handleRemoveFromContainer,
    isTogglingWanted,
    wantedModalVisible,
    openWantedModal,
    closeWantedModal,
    handleToggleWantedStatus,
    handleSubmitWanted,
    printWaybill,
    printProformaInvoice,
    printHandoverCheck,

    // container transfers
    isContainerTransfersModalVisible,
    openContainerTransfersModal,
    closeContainerTransfersModal,

    // DGK accordion + modal
    customsStatus,
    customStatusName,
    customsStatesInfo,
    isAccordionOpen,
    handleAccordionChange,
    customsStatusModalOpen,
    openCustomsStatusModal,
    closeCustomsStatusModal,

    // DGK raw response modal
    isCustomsRawModalOpen,
    openCustomsRawModal,
    closeCustomsRawModal,

    // united / trendyol
    parcelStates: parcelStatesQuery.data,
    trendyolStatus,
    changeTrendyolStatus,
    customsStatusName,

    // FIN code editing
    pinCodeEditing,
    onTogglePinCodeEditing,
    onPinCodeSubmit,
    form,
  };
};
