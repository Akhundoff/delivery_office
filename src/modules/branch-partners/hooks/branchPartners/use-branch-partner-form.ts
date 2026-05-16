import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";

import { useCloseModal } from "@shared/hooks";
import { BranchPartnersService } from "../../services";
import { IBranchPartnerFormValues } from "../../interfaces";

export const useBranchPartnerForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();

  const detail = useQuery(
    ["branch-partners", id],
    async () => {
      const result = await BranchPartnersService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IBranchPartnerFormValues>(() => {
    if (id && detail.data) {
      return {
        name: detail.data.name,
        isOwner: detail.data.isOwner,
        description: detail.data.description,
        contact: detail.data.contact,
      };
    }
    return { name: "", isOwner: false, description: "", contact: "" };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (
      values: IBranchPartnerFormValues,
      helpers: FormikHelpers<IBranchPartnerFormValues>,
    ) => {
      const result = id
        ? await BranchPartnersService.update(id, values)
        : await BranchPartnersService.create(values);

      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Şirkət yaradıldı");
        closeModal("/branch-partners", { reFetchBranchPartnersTable: "1" });
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const map: Record<string, string> = {
          name: "name",
          is_owner: "isOwner",
          descr: "description",
          contact: "contact",
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
