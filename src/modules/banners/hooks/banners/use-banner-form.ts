import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";
import { useBackgroundNavigate } from "@shared/hooks";
import { localURLMaker } from "@shared/utils";
import { BannersService } from "../../services";
import { IBannerFormValues } from "../../interfaces";

export const useBannerForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ["banners", id],
    async () => {
      const result = await BannersService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IBannerFormValues>(() => {
    if (id && detail.data) {
      return {
        name: detail.data.name,
        type: String(detail.data.type),
        active: detail.data.active,
        documentFile: null,
      };
    }
    return { name: "", type: "", active: true, documentFile: null };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (
      values: IBannerFormValues,
      helpers: FormikHelpers<IBannerFormValues>,
    ) => {
      const result = id
        ? await BannersService.update(id, values)
        : await BannersService.create(values);
      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Banner yaradıldı");
        navigate(localURLMaker('/banners', {}, { reFetchBannersTable: '1' }));
      } else if (result.status === 422) {
        helpers.setErrors(result.data as any);
      } else {
        message.error((result.data as string) || "Xəta baş verdi");
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return {
    initialValues,
    onSubmit,
    id,
    isLoading: !!id && (detail.isLoading || !detail.data),
  };
};
