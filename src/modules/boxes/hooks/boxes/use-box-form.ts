import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";
import { useCloseModal } from "@shared/hooks";
import { BoxesService } from "../../services";
import { IBoxFormValues } from "../../interfaces";

export const useBoxForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();

  const detail = useQuery(["boxes", id], async () => {
    const result = await BoxesService.getById(id!);
    if (result.status === 200) return result.data;
    throw new Error(result.data as string);
  }, { enabled: !!id });

  const initialValues = useMemo<IBoxFormValues>(() => {
    if (id && detail.data) return { name: detail.data.name, branchId: String(detail.data.branch?.id || "") };
    return { name: "", branchId: "" };
  }, [id, detail.data]);

  const onSubmit = useCallback(async (values: IBoxFormValues, helpers: FormikHelpers<IBoxFormValues>) => {
    const result = id ? await BoxesService.update(id, values) : await BoxesService.create(values);
    if (result.status === 200) {
      message.success(id ? "Dəyişikliklər saxlanıldı" : "Yeşik yaradıldı");
      closeModal("/boxes");
    } else if (result.status === 422) {
      const errors: Record<string, string> = {};
      const map: Record<string, string> = { container_name: "name", branch_id: "branchId" };
      Object.entries(result.data as Record<string, string[]>).forEach(([k, v]) => {
        errors[map[k] || k] = Array.isArray(v) ? v.join(", ") : String(v);
      });
      helpers.setErrors(errors);
    } else {
      message.error((result.data as string) || "Xəta baş verdi");
    }
    helpers.setSubmitting(false);
  }, [id, closeModal]);

  return { initialValues, onSubmit, id, isLoading: !!id && (detail.isLoading || !detail.data) };
};
