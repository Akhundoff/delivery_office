import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FormikHelpers } from "formik";
import { message } from "antd";
import { CreateDiscountDto } from "../../interfaces";
import { UsersService } from "../../services";
import { useBackgroundNavigate } from "@shared/hooks";

export const useCreateDiscount = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useBackgroundNavigate();

  const initialValues = useMemo<CreateDiscountDto>(
    () => ({
      discount: "",
      discountDate: null,
      countryId: null,
      descr: "",
    }),
    [],
  );

  const onSubmit = useCallback(
    async (
      values: CreateDiscountDto,
      helpers: FormikHelpers<CreateDiscountDto>,
    ) => {
      if (!id) return;
      const result = await UsersService.createDiscount(id, values);
      if (result.status === 200) {
        message.success("Endirim əlavə edildi");
        navigate(`/users/${id}`, { withBackground: false });
      } else if (result.status === 422) {
        message.error(result.data);
      } else {
        message.error(result.data);
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return { initialValues, onSubmit };
};
