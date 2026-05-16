import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";
import { useCloseModal } from "@shared/hooks";
import { FaqService } from "../../services";
import { IFaqFormValues } from "../../interfaces";

export const useFaqForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();

  const detail = useQuery(
    ["faq", id],
    async () => {
      const result = await FaqService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IFaqFormValues>(() => {
    if (id && detail.data) {
      return { question: detail.data.question, answer: detail.data.answer, sort: detail.data.sort };
    }
    return { question: "", answer: "", sort: "" };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: IFaqFormValues, helpers: FormikHelpers<IFaqFormValues>) => {
      const result = id ? await FaqService.update(id, values) : await FaqService.create(values);
      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Sual yaradıldı");
        closeModal("/faq");
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
