import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";
import { useCloseModal } from "@shared/hooks";
import { ShopNamesService } from "../../services";
import { IShopNameFormValues } from "../../interfaces";

export const useShopNameForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();

  const detail = useQuery(["shop-names", id], async () => {
    const result = await ShopNamesService.getById(id!);
    if (result.status === 200) return result.data;
    throw new Error(result.data as string);
  }, { enabled: !!id });

  const initialValues = useMemo<IShopNameFormValues>(() => {
    if (id && detail.data) return { name: detail.data.name, countryId: String(detail.data.countryId || "") };
    return { name: "", countryId: "" };
  }, [id, detail.data]);

  const onSubmit = useCallback(async (values: IShopNameFormValues, helpers: FormikHelpers<IShopNameFormValues>) => {
    const result = id ? await ShopNamesService.update(id, values) : await ShopNamesService.create(values);
    if (result.status === 200) {
      message.success(id ? "Dəyişikliklər saxlanıldı" : "Mağaza yaradıldı");
      closeModal("/shop-names");
    } else if (result.status === 422) {
      const errors: Record<string, string> = {};
      Object.entries(result.data as Record<string, string[]>).forEach(([k, v]) => {
        errors[k] = Array.isArray(v) ? v.join(", ") : String(v);
      });
      helpers.setErrors(errors);
    } else {
      message.error((result.data as string) || "Xəta baş verdi");
    }
    helpers.setSubmitting(false);
  }, [id, closeModal]);

  return { initialValues, onSubmit, id, isLoading: !!id && (detail.isLoading || !detail.data) };
};
