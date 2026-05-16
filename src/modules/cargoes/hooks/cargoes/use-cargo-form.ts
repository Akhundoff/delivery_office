import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";
import { useBackgroundNavigate } from "@shared/hooks";
import { localURLMaker } from "@shared/utils";
import { CargoesService } from "../../services";
import { ICargoFormValues } from "../../interfaces";

export const useCargoForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ["cargoes", id],
    async () => {
      const result = await CargoesService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<ICargoFormValues>(() => {
    if (id && detail.data) return { name: detail.data.name, description: detail.data.description };
    return { name: "", description: "" };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: ICargoFormValues, helpers: FormikHelpers<ICargoFormValues>) => {
      const result = id ? await CargoesService.update(id, values) : await CargoesService.create(values);
      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Karqo yaradıldı");
        navigate(localURLMaker('/cargoes', {}, { reFetchCargoesTable: '1' }));
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const errors: Record<string, string> = {};
        const map: Record<string, string> = { cargo_name: "name", descr: "description" };
        Object.entries(raw).forEach(([k, v]) => {
          errors[map[k] || k] = Array.isArray(v) ? v.join(", ") : String(v);
        });
        helpers.setErrors(errors);
      } else {
        message.error((result.data as string) || "Xəta baş verdi");
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return { initialValues, onSubmit, id, isLoading: !!id && (detail.isLoading || !detail.data) };
};
