import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";
import { useCloseModal } from "@shared/hooks";
import { ShopsService } from "../../services";
import { IShopFormValues } from "../../interfaces";

export const useShopForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();

  const detail = useQuery(
    ["shops", id],
    async () => {
      const result = await ShopsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IShopFormValues>(() => {
    if (id && detail.data) {
      return {
        label: detail.data.label,
        url: detail.data.url,
        countryId: String(detail.data.countryId ?? ""),
        categoryIds: detail.data.categoryIds.map(String),
        logo: null,
      };
    }
    return { label: "", url: "", countryId: "", categoryIds: [], logo: null };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: IShopFormValues, helpers: FormikHelpers<IShopFormValues>) => {
      const result = id ? await ShopsService.update(id, values) : await ShopsService.create(values);
      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Mağaza yaradıldı");
        closeModal("/shops");
      } else if (result.status === 422) {
        helpers.setErrors(result.data as any);
      } else {
        message.error((result.data as string) || "Xəta baş verdi");
      }
      helpers.setSubmitting(false);
    },
    [id, closeModal],
  );

  return { initialValues, onSubmit, id, isLoading: !!id && (detail.isLoading || !detail.data) };
};
