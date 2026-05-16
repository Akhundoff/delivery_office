import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";
import { useBackgroundNavigate } from "@shared/hooks";
import { localURLMaker } from "@shared/utils";
import { PopupsService } from "../../services";
import { IPopupFormValues, PopupTarget, PopupType } from "../../interfaces";

export const usePopupForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ["popups", id],
    async () => {
      const result = await PopupsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IPopupFormValues>(() => {
    if (id && detail.data) {
      return {
        title: detail.data.title,
        message: detail.data.message,
        startDate: detail.data.startDate,
        endDate: detail.data.endDate,
        buttonLink: detail.data.buttonLink,
        buttonName: detail.data.buttonName,
        buttonLinkMobile: detail.data.buttonLinkMobile,
        target: detail.data.target,
        type: detail.data.type,
        maxShowCount: String(detail.data.maxShowCount),
      };
    }
    return {
      title: "",
      message: "",
      startDate: "",
      endDate: "",
      buttonLink: "",
      buttonName: "",
      buttonLinkMobile: "",
      target: PopupTarget.BOTH,
      type: PopupType.STANDART,
      maxShowCount: "",
    };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: IPopupFormValues, helpers: FormikHelpers<IPopupFormValues>) => {
      const result = id ? await PopupsService.update(id, values) : await PopupsService.create(values);
      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Popup yaradıldı");
        navigate(localURLMaker('/popups', {}, { reFetchPopupsTable: '1' }));
      } else if (result.status === 422) {
        helpers.setErrors(result.data as any);
      } else {
        message.error((result.data as string) || "Xəta baş verdi");
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return { initialValues, onSubmit, id, isLoading: !!id && (detail.isLoading || !detail.data) };
};
