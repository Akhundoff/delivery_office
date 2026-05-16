import { useCallback, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";

import { useBackgroundNavigate } from "@shared/hooks";
import { localURLMaker } from "@shared/utils";
import { SettingsContext } from "@modules/settings";
import { UsersService } from "@modules/users/services";

import { IDeclarationFormValues } from "../../interfaces";
import { DeclarationsService } from "../../services";

export const useDeclarationForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();
  const settings = useContext(SettingsContext);

  const declaration = useQuery(
    ["declarations", id],
    async () => {
      const result = await DeclarationsService.getDeclarationById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const productTypes = useQuery(
    ["declarations-product-types"],
    async () => {
      const result = await DeclarationsService.getProductTypes();
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const planCategories = useQuery(
    ["declarations-plan-categories"],
    async () => {
      const result = await DeclarationsService.getPlanCategories();
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const users = useQuery(
    ["users-select"],
    async () => {
      const result = await UsersService.getUsers({ per_page: 1000 });
      if (result.status === 200)
        return result.data.data.map((u) => ({
          id: u.id,
          name: u.firstname + " " + u.lastname,
        }));
      throw new Error("İstifadəçilər əldə edilə bilmədi");
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const defaultCountryId = useMemo(() => {
    const tr = settings.data?.countries.find((c) => c.abbr === "TR");
    return tr ? String(tr.id) : "";
  }, [settings.data]);

  const isLoading = !!id && (declaration.isLoading || !declaration.data);

  const initialValues = useMemo<IDeclarationFormValues>(() => {
    const d = declaration.data;
    if (id && d) {
      return {
        userId: String(d.user.id),
        globalTrackCode: d.globalTrackCode || "",
        shop: d.shop || "",
        productTypeId: String(d.productType?.id || ""),
        quantity: String(d.quantity || 1),
        weight: String(d.weight || ""),
        price: String(d.price || ""),
        deliveryPrice: String(d.deliveryPrice || ""),
        voen: d.voen || "",
        isLiquid: d.type === "liquid",
        isSpecial: (d.planCategory?.id || 0) > 1,
        planTypeId: String(d.planCategory?.id || ""),
        wardrobeNumber: d.wardrobeNumber || "",
        boxId: String(d.box?.id || ""),
        file: null,
        description: d.description || "",
        countryId: String(d.countryId || defaultCountryId),
        branchId: String(d.branch?.id || ""),
        isCommercial: d.isCommercial || false,
      };
    }
    return {
      userId: "",
      globalTrackCode: "",
      shop: "",
      productTypeId: "",
      quantity: "1",
      weight: "",
      price: "",
      deliveryPrice: "",
      voen: "",
      isLiquid: false,
      isSpecial: false,
      planTypeId: "",
      wardrobeNumber: "",
      boxId: "",
      file: null,
      description: "",
      countryId: defaultCountryId,
      branchId: "",
      isCommercial: false,
    };
  }, [id, declaration.data, defaultCountryId]);

  const onSubmit = useCallback(
    async (
      values: IDeclarationFormValues,
      helpers: FormikHelpers<IDeclarationFormValues>,
    ) => {
      const result = id
        ? await DeclarationsService.updateDeclaration(id, values)
        : await DeclarationsService.createDeclaration(values);

      if (result.status === 200) {
        message.success(
          id ? "Dəyişikliklər saxlanıldı" : "Bəyannamə yaradıldı",
        );
        navigate(localURLMaker('/declarations', {}, { reFetchDeclarationsTable: '1' }));
      } else if (result.status === 422) {
        const errors: Record<string, string> = {};
        const raw = result.data as Record<string, string[]>;
        Object.entries(raw).forEach(([key, val]) => {
          const map: Record<string, string> = {
            declaration_id: "id",
            country_id: "countryId",
            user_id: "userId",
            global_track_code: "globalTrackCode",
            declaration_unique_error: "globalTrackCode",
            product_type_id: "productTypeId",
            tariff_category_id: "planTypeId",
            type: "isLiquid",
            wardrobe_number: "wardrobeNumber",
            shop_name: "shop",
            document_file: "file",
            descr: "description",
            container_id: "boxId",
            branch_id: "branchId",
          };
          const field = map[key] || key;
          errors[field] = Array.isArray(val) ? val.join(", ") : String(val);
        });
        helpers.setErrors(errors);
      } else {
        message.error((result.data as string) || "Xəta baş verdi");
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return {
    initialValues,
    onSubmit,
    id,
    isLoading,
    productTypes: productTypes.data ?? [],
    planCategories: planCategories.data ?? [],
    users: users.data ?? [],
  };
};
