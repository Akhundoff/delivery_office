import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";

import { useCloseModal } from "@shared/hooks";
import { BranchesService } from "../../services";
import { IBranchFormValues } from "../../interfaces";

const emptyValues: IBranchFormValues = {
  name: "",
  descr: "",
  address: "",
  phone: "",
  email: "",
  workinghours: "",
  isBranch: false,
  isRegionBranch: false,
  hide: false,
  latitude: "",
  longitude: "",
  mapUrl: "",
  parentId: "",
  stateId: "",
  companyId: "",
  sortingLetter: "",
  openHour: "",
  closeHour: "",
};

export const useBranchForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();

  const detail = useQuery(
    ["branches", id],
    async () => {
      const result = await BranchesService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IBranchFormValues>(() => {
    if (id && detail.data) {
      const d = detail.data;
      return {
        name: d.name,
        descr: d.descr,
        address: d.address,
        phone: d.phone,
        email: d.email,
        workinghours: d.workinghours,
        isBranch: d.isBranch,
        isRegionBranch: d.isRegionBranch,
        hide: d.hide,
        latitude: d.latitude,
        longitude: d.longitude,
        mapUrl: d.mapUrl,
        parentId: d.parent ? String(d.parent.id) : "",
        stateId: d.status ? String(d.status.id) : "",
        companyId: d.company ? String(d.company.id) : "",
        sortingLetter: d.sortingLetter,
        openHour: "",
        closeHour: "",
      };
    }
    return emptyValues;
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: IBranchFormValues, helpers: FormikHelpers<IBranchFormValues>) => {
      const result = id
        ? await BranchesService.update(id, values)
        : await BranchesService.create(values);

      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Filial yaradıldı");
        closeModal("/branches");
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const errors: Record<string, string> = {};
        Object.entries(raw).forEach(([k, v]) => {
          errors[k] = Array.isArray(v) ? v.join(", ") : String(v);
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
