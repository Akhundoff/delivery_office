import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FormikHelpers } from "formik";
import { message } from "antd";
import dayjs from "dayjs";

import { useBackgroundNavigate } from "@shared/hooks";
import { localURLMaker } from "@shared/utils";
import { UsersService } from "../../services";
import { CreateUserDto } from "../../interfaces";
import { useGetUserById } from "./use-get-user-by-id";

export const useCreateUser = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const userQuery = useGetUserById(id);

  const initialValues = useMemo<CreateUserDto>(() => {
    if (id && userQuery.data) {
      const u = userQuery.data;
      return {
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        phoneNumber: u.phoneNumber || "",
        gender: u.gender || "male",
        birthDate: u.birthDate ? dayjs(u.birthDate) : null,
        address: u.address || "",
        branchId: u.branch.id ? String(u.branch.id) : "",
        passport: {
          number: u.passport.number || "",
          secret: u.passport.secret || "",
        },
        password: "",
        passwordConfirmation: "",
        sendEmail: u.sendEmail,
        sendSms: u.sendSms,
      };
    }

    return {
      firstname: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      gender: "male",
      birthDate: dayjs().subtract(20, "years"),
      address: "",
      branchId: "",
      passport: { number: "", secret: "" },
      password: "",
      passwordConfirmation: "",
      sendEmail: false,
      sendSms: false,
    };
  }, [id, userQuery.data]);

  const onSubmit = useCallback(
    async (values: CreateUserDto, helpers: FormikHelpers<CreateUserDto>) => {
      const result = id
        ? await UsersService.updateUser(id, values)
        : await UsersService.createUser(values);

      if (result.status === 200) {
        message.success(
          id ? "Dəyişikliklər saxlanıldı" : "İstifadəçi yaradıldı",
        );
        navigate(localURLMaker('/users', {}, { reFetchUsersTable: '1' }));
      } else {
        message.error((result.data as string) || "Xəta baş verdi");
        helpers.setSubmitting(false);
      }
    },
    [id, navigate],
  );

  const isLoading = !!id && userQuery.isLoading;

  return { initialValues, onSubmit, id, isLoading };
};
