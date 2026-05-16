import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FormikHelpers } from "formik";
import { message } from "antd";

import { useBackgroundNavigate } from "@shared/hooks";
import { localURLMaker } from "@shared/utils";
import { CountriesService } from "../../services";
import { ICountryFormValues } from "../../interfaces";

const emptyValues: ICountryFormValues = {
  name: "",
  abbr: "",
  currency: "",
  currencyType: "",
  countryCode: "",
  unit: "KG",
  address: "",
  addressHeading: "",
  minSize: "",
  box: false,
  isOrder: false,
  isDeclaration: false,
  fullDeclaration: false,
  zeroPrice: false,
  zeroSend: false,
  smsConfirmation: false,
  hasWarehouse: false,
  description: "",
  stateId: "",
  carrierCompanyName: "",
  carrierCompanyAddress: "",
  carrierCompanyPhone: "",
};

export const useCountryForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ["countries", id],
    async () => {
      const result = await CountriesService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<ICountryFormValues>(() => {
    if (id && detail.data) {
      const d = detail.data;
      return {
        name: d.name,
        abbr: d.abbr,
        currency: d.currency,
        currencyType: d.currencyType,
        countryCode: d.countryCode,
        unit: d.unit,
        address: d.address,
        addressHeading: "",
        minSize: String(d.minSize),
        box: d.box,
        isOrder: d.isOrder,
        isDeclaration: d.isDeclaration,
        fullDeclaration: d.fullDeclaration,
        zeroPrice: d.zeroPrice,
        zeroSend: d.zeroSend,
        smsConfirmation: d.smsConfirmation,
        hasWarehouse: d.hasWarehouse,
        description: d.description,
        stateId: d.state ? String(d.state.id) : "",
        carrierCompanyName: "",
        carrierCompanyAddress: "",
        carrierCompanyPhone: "",
      };
    }
    return emptyValues;
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: ICountryFormValues, helpers: FormikHelpers<ICountryFormValues>) => {
      const result = id
        ? await CountriesService.update(id, values)
        : await CountriesService.create(values);

      if (result.status === 200) {
        message.success(id ? "Dəyişikliklər saxlanıldı" : "Ölkə yaradıldı");
        navigate(localURLMaker('/countries', {}, { reFetchCountriesTable: '1' }));
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const map: Record<string, string> = {
          country_name: "name",
          descr: "description",
          state_id: "stateId",
          currency_type: "currencyType",
          country_code: "countryCode",
          address_heading: "addressHeading",
          min_size: "minSize",
          carrier_company_name: "carrierCompanyName",
          carrier_company_address: "carrierCompanyAddress",
          carrier_company_phone: "carrierCompanyPhone",
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
    [id, navigate],
  );

  return {
    initialValues,
    onSubmit,
    id,
    isLoading: !!id && (detail.isLoading || !detail.data),
  };
};
