import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";

import { useCloseModal } from "@shared/hooks";
import { ReturnTypesService } from "../../services";
import { IReturnTypeFormValues } from "../../interfaces";

export const useReturnTypeForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();

  const detail = useQuery(
    ["return-types", id],
    async () => {
      const result = await ReturnTypesService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IReturnTypeFormValues>(() => {
    if (id && detail.data) {
      return { name: detail.data.name };
    }
    return { name: "" };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (
      values: IReturnTypeFormValues,
      helpers: FormikHelpers<IReturnTypeFormValues>,
    ) => {
      const result = id
        ? await ReturnTypesService.update(id, values)
        : await ReturnTypesService.create(values);

      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "İadə səbəbi yaradıldı");
        closeModal("/return-types", { reFetchReturnTypesTable: "1" });
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const errors: Record<string, string> = {};
        Object.entries(raw).forEach(([k, v]) => {
          errors[k === "reason" ? "name" : k] = Array.isArray(v) ? v.join(", ") : String(v);
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
