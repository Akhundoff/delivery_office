import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";

import { useCloseModal } from "@shared/hooks";
import { ProductTypesService } from "../../services";
import { IProductTypeFormValues } from "../../interfaces";

export const useProductTypeForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();

  const detail = useQuery(
    ["product-types", id],
    async () => {
      const result = await ProductTypesService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IProductTypeFormValues>(() => {
    if (id && detail.data) {
      return {
        name: detail.data.name,
        nameEn: detail.data.nameEn,
        nameRu: detail.data.nameRu,
        nameTr: detail.data.nameTr,
        statusId: detail.data.status ? String(detail.data.status.id) : "",
      };
    }
    return { name: "", nameEn: "", nameRu: "", nameTr: "", statusId: "" };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (
      values: IProductTypeFormValues,
      helpers: FormikHelpers<IProductTypeFormValues>,
    ) => {
      const result = id
        ? await ProductTypesService.update(id, values)
        : await ProductTypesService.create(values);

      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Məhsul tipi yaradıldı");
        closeModal("/product-types", { reFetchProductTypesTable: "1" });
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const map: Record<string, string> = {
          name: "name",
          name_en: "nameEn",
          name_ru: "nameRu",
          name_tr: "nameTr",
          state_id: "statusId",
        };
        const errors: Record<string, string> = {};
        Object.entries(raw).forEach(([k, v]) => {
          const key = map[k] || k;
          errors[key] = Array.isArray(v) ? v.join(", ") : String(v);
        });
        helpers.setErrors(errors);
      } else {
        message.error((result.data as string) || "Xəta baş verdi");
      }
      helpers.setSubmitting(false);
    },
    [id, closeModal],
  );

  return {
    initialValues,
    onSubmit,
    id,
    isLoading: !!id && (detail.isLoading || !detail.data),
  };
};
