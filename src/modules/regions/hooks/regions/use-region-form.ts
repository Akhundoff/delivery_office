import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";

import { useCloseModal } from "@shared/hooks";
import { RegionsService } from "../../services";
import { IRegionFormValues } from "../../interfaces";

export const useRegionForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();

  const detail = useQuery(
    ["regions", id],
    async () => {
      const result = await RegionsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IRegionFormValues>(() => {
    if (id && detail.data) {
      return {
        name: detail.data.name,
        price: String(detail.data.price),
        courierPrice: detail.data.courierPrice,
        branchIds: detail.data.branches.map((b) => String(b.id)),
        shipping: String(detail.data.shipping),
        description: detail.data.description,
      };
    }
    return { name: "", price: "", courierPrice: "", branchIds: [], shipping: "", description: "" };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (
      values: IRegionFormValues,
      helpers: FormikHelpers<IRegionFormValues>,
    ) => {
      const result = id
        ? await RegionsService.update(id, values)
        : await RegionsService.create(values);

      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Rayon yaradıldı");
        closeModal("/regions");
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const map: Record<string, string> = {
          name: "name",
          price: "price",
          courier_price: "courierPrice",
          "branch_id[]": "branchIds",
          shipping: "shipping",
          descr: "description",
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
