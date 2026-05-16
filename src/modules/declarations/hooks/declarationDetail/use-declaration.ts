import { useCallback, useState } from "react";
import { message, Modal } from "antd";
import { useQuery } from "react-query";

import { useBackgroundNavigate } from "@shared/hooks";
import { useDeclarationDetail } from "./use-declaration-detail";
import { DeclarationsService } from "../../services";

export const useDeclaration = (id: string) => {
  const navigate = useBackgroundNavigate();
  const detail = useDeclarationDetail(id);

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

  const data = detail.data;
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

  return {
    data,
    isLoading: detail.isLoading,
    error: detail.error?.message ?? null,
    orderIds: orderIds.data ?? [],
    canHandover,
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
    closeWantedModal,
    handleToggleWantedStatus,
    handleSubmitWanted,
  };
};
