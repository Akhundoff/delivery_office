import { useCallback, useMemo, useState } from "react";
import { message } from "antd";
import { FormikErrors } from "formik";

import { DeclarationsService } from "../../services";
import { IDeclaration } from "../../interfaces";

export type ICommercialDeclarationDto = {
  awb: string;
  declarationId: string;
  voen: string;
};

export const useAddCommercial = (id: number, data?: IDeclaration) => {
  const [commercialModalOpen, setCommercialModalOpen] = useState(false);

  const initialValues = useMemo<ICommercialDeclarationDto>(
    () => ({
      awb: data?.awb || "",
      declarationId: id.toString(),
      voen: data?.voen || "",
    }),
    [id, data],
  );

  const openModal = useCallback(() => setCommercialModalOpen(true), []);
  const closeModal = useCallback(() => setCommercialModalOpen(false), []);

  const addCommercialVoen = useCallback(
    async (values: ICommercialDeclarationDto, setErrors: (errors: FormikErrors<ICommercialDeclarationDto>) => void, reset: () => void) => {
      const result = await DeclarationsService.addCommercial(values);
      if (result.status === 200) {
        setCommercialModalOpen(false);
        reset();
      } else if (result.status === 422) {
        const errors = Object.entries(result.data).reduce<Record<string, string>>((acc, [key, messages]) => ({ ...acc, [key]: messages.join(", ") }), {});
        setErrors(errors);
      } else {
        message.error(result.data as string);
      }
    },
    [],
  );

  return { initialValues, addCommercialVoen, commercialModalOpen, openModal, closeModal };
};
