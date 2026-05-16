import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";
import { useCloseModal } from "@shared/hooks";
import { NewsService } from "../../services";
import { INewsFormValues } from "../../interfaces";

export const useNewsForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();

  const detail = useQuery(
    ["news", id],
    async () => {
      const result = await NewsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<INewsFormValues>(() => {
    if (id && detail.data) {
      return { title: detail.data.title, descr: detail.data.descr, body: detail.data.body, image: null };
    }
    return { title: "", descr: "", body: "", image: null };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: INewsFormValues, helpers: FormikHelpers<INewsFormValues>) => {
      const result = id ? await NewsService.update(id, values) : await NewsService.create(values);
      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Xəbər yaradıldı");
        closeModal("/news");
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
