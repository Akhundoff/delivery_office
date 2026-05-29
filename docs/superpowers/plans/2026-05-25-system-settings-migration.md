# System Settings Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all settings sections from `delivery_management` into `delivery_management_new`, fix broken checkbox labels, fix submit key mapping, and add four missing sections (Cashflow, Azerpost, Trendyol, Topup).

**Architecture:** Each settings section is a self-contained container that calls `useSettingsGroup(groupId, defaultValues, fromApi, toApi)`. `fromApi` maps snake_case API responses to camelCase form fields; `toApi` maps them back before submit. The Cashflow section additionally fetches cashbox options from `/api/admin/cashboxes` via a dedicated hook.

**Tech Stack:** React 18, TypeScript, Formik, Ant Design v5, react-query, `@shared/modules/form` field components.

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/shared/modules/form/fields/checkbox.tsx` |
| Modify | `src/modules/system-settings/hooks/settings/use-settings-group.ts` |
| Modify | `src/modules/system-settings/services/index.ts` |
| Modify | `src/modules/system-settings/containers/others-settings.tsx` |
| Modify | `src/modules/system-settings/containers/cashback-settings.tsx` |
| Modify | `src/modules/system-settings/containers/mail-settings.tsx` |
| Create | `src/modules/system-settings/hooks/cashboxes/index.ts` |
| Create | `src/modules/system-settings/containers/azerpost-settings.tsx` |
| Create | `src/modules/system-settings/containers/trendyol-settings.tsx` |
| Create | `src/modules/system-settings/containers/topup-settings.tsx` |
| Create | `src/modules/system-settings/containers/cashflow-settings.tsx` |
| Modify | `src/modules/system-settings/hooks/index.ts` |
| Modify | `src/modules/system-settings/containers/index.ts` |
| Modify | `src/modules/system-settings/pages/index.tsx` |

---

## Task 1: Fix CheckboxField — render `props.children` as label

**Files:**
- Modify: `src/shared/modules/form/fields/checkbox.tsx`

- [ ] **Replace the entire file** with a version that renders `children` (passed directly to `CheckboxField`) inside the `<Checkbox>`, falling back to `input?.children`:

```tsx
import React, { FC } from 'react';
import { Checkbox, Form } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import { FormItemProps } from 'antd/lib/form';
import { useField, FieldHookConfig } from 'formik';

export type CheckboxFieldProps = FieldHookConfig<boolean> & {
  item?: FormItemProps;
  input?: CheckboxProps & { children?: React.ReactNode };
  children?: React.ReactNode;
};

export const CheckboxField: FC<CheckboxFieldProps> = ({ item, input, children, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });

  return (
    <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.touched ? meta.error : undefined}>
      <Checkbox {...field} {...input} checked={field.checked}>
        {children ?? input?.children}
      </Checkbox>
    </Form.Item>
  );
};
```

- [ ] **Commit:**

```bash
git add src/shared/modules/form/fields/checkbox.tsx
git commit -m "fix(form): render children prop inside CheckboxField label"
```

---

## Task 2: Add `toApi` parameter to `useSettingsGroup`

**Files:**
- Modify: `src/modules/system-settings/hooks/settings/use-settings-group.ts`

- [ ] **Replace the entire file:**

```ts
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { FormikErrors, FormikHelpers } from "formik";
import { message } from "antd";
import { SystemSettingsService } from "../../services";

export const useSettingsGroup = <T extends Record<string, any>>(
  groupId: string,
  defaultValues: T,
  fromApi?: (raw: Record<string, any>) => Partial<T>,
  toApi?: (values: T) => Record<string, any>,
) => {
  const query = useQuery(
    ["settings", groupId],
    async () => {
      const result = await SystemSettingsService.getGroup(groupId);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const initialValues = useMemo<T>(() => {
    if (!query.data) return defaultValues;
    const mapped = fromApi ? fromApi(query.data) : query.data;
    return { ...defaultValues, ...mapped } as T;
  }, [query.data, defaultValues, fromApi]);

  const onSubmit = useCallback(
    async (values: T, helpers: FormikHelpers<T>) => {
      const payload = toApi ? toApi(values) : values;
      const result = await SystemSettingsService.updateGroup(groupId, payload);
      if (result.status === 200) {
        message.success("Dəyişikliklər saxlanıldı");
      } else if (result.status === 422) {
        helpers.setErrors(result.data as FormikErrors<T>);
      } else {
        message.error((result.data as string) || "Xəta baş verdi");
      }
      helpers.setSubmitting(false);
    },
    [groupId, toApi],
  );

  return { initialValues, onSubmit, isLoading: query.isLoading };
};
```

- [ ] **Commit:**

```bash
git add src/modules/system-settings/hooks/settings/use-settings-group.ts
git commit -m "feat(system-settings): add toApi mapper parameter to useSettingsGroup"
```

---

## Task 3: Fix `updateGroup` service — handle File objects in FormData

**Files:**
- Modify: `src/modules/system-settings/services/index.ts`

- [ ] **Replace the `updateGroup` method** so `File`/`Blob` values are appended directly instead of being stringified:

```ts
import { ApiResult, caller, urlMaker } from "@shared/utils";

export type ISettingsGroup = Record<string, any>;

export const SystemSettingsService = {
  getGroup: async (groupId: string): Promise<ApiResult<200, ISettingsGroup> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/settings/data", { group_id: groupId });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, result.data || {}, null);
      }
      return new ApiResult(400, "Məlumatlar əldə edilə bilmədi", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  updateGroup: async (groupId: string, values: Record<string, any>): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/settings/data");
    const body = new FormData();
    body.append("group_id", groupId);
    Object.entries(values).forEach(([k, v]) => {
      if (v instanceof File || v instanceof Blob) {
        body.append(k, v);
      } else {
        body.append(k, v === true ? "1" : v === false ? "0" : String(v ?? ""));
      }
    });
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 422) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
```

- [ ] **Commit:**

```bash
git add src/modules/system-settings/services/index.ts
git commit -m "fix(system-settings): handle File/Blob values in updateGroup FormData"
```

---

## Task 4: Fix `OthersSettings` — switch to SwitchField + correct mappers

**Files:**
- Modify: `src/modules/system-settings/containers/others-settings.tsx`

- [ ] **Replace the entire file:**

```tsx
import { FC } from "react";
import { Button, Col, Form, Row, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { SwitchField } from "@shared/modules/form/fields/switch";
import { useSettingsGroup } from "../hooks";

const defaultValues = {
  orderPercent: "",
  smallPackage: "",
  mediumPackage: "",
  bigPackage: "",
  customs: false,
  orderStatus: false,
  declarationStatus: false,
  courierStatus: false,
  whatsapp: false,
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  orderPercent: raw.order_percent ?? "",
  smallPackage: raw.package_price?.small_package?.toString() ?? "",
  mediumPackage: raw.package_price?.medium_package?.toString() ?? "",
  bigPackage: raw.package_price?.big_package?.toString() ?? "",
  customs: !!Number(raw.customs),
  orderStatus: !!Number(raw.order_status),
  declarationStatus: !!Number(raw.declaration_status),
  courierStatus: !!Number(raw.courier_status),
  whatsapp: !!Number(raw.whatsapp),
});

const toApi = (values: typeof defaultValues) => ({
  order_percent: values.orderPercent,
  small_package: values.smallPackage,
  medium_package: values.mediumPackage,
  big_package: values.bigPackage,
  customs: values.customs ? "1" : "0",
  order_status: values.orderStatus ? "1" : "0",
  declaration_status: values.declarationStatus ? "1" : "0",
  courier_status: values.courierStatus ? "1" : "0",
  whatsapp: values.whatsapp ? "1" : "0",
});

const OthersSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}><TextField name="orderPercent" item={{ label: "Sifariş faizi" }} input={{ placeholder: "%" }} /></Col>
      <Col span={12}><TextField name="smallPackage" item={{ label: "Kiçik paket qiyməti" }} input={{ placeholder: "0.00" }} /></Col>
      <Col span={12}><TextField name="mediumPackage" item={{ label: "Orta paket qiyməti" }} input={{ placeholder: "0.00" }} /></Col>
      <Col span={12}><TextField name="bigPackage" item={{ label: "Böyük paket qiyməti" }} input={{ placeholder: "0.00" }} /></Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 8 }}>
      <Col span={8}><SwitchField name="customs" item={{ label: "Bağlamalar gömrükə göndərilsin" }} /></Col>
      <Col span={8}><SwitchField name="orderStatus" item={{ label: "Sifariş yaratmaq" }} /></Col>
      <Col span={8}><SwitchField name="declarationStatus" item={{ label: "Bağlama yaratmaq" }} /></Col>
      <Col span={8}><SwitchField name="courierStatus" item={{ label: "Kuryer yaratmaq" }} /></Col>
      <Col span={8}><SwitchField name="whatsapp" item={{ label: "WhatsApp bildirişlər" }} /></Col>
    </Row>
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
    </div>
  </Form>
);

export const OthersSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("others", defaultValues, fromApi, toApi);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <OthersSettingsForm {...f} />}
    </Formik>
  );
};
```

- [ ] **Commit:**

```bash
git add src/modules/system-settings/containers/others-settings.tsx
git commit -m "fix(system-settings): use SwitchField for booleans and add toApi mapper in OthersSettings"
```

---

## Task 5: Rebuild `CashbackSettings` — align with old project fields

**Files:**
- Modify: `src/modules/system-settings/containers/cashback-settings.tsx`

- [ ] **Replace the entire file:**

```tsx
import { FC } from "react";
import { Button, Col, Form, Row, Select, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { SelectField } from "@shared/modules/form/fields/select";
import { useSettingsGroup } from "../hooks";

const defaultValues = {
  cashbackPercent: "",
  cashbackMax: "",
  cashbackMin: "",
  cashbackBalance: "",
  cashbackAvtoMax: "",
  expired: "",
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  cashbackPercent: raw.cashback_percent ?? "",
  cashbackMax: raw.cashback_max ?? "",
  cashbackMin: raw.cashback_min ?? "",
  cashbackBalance: raw.cashback_balance ?? "",
  cashbackAvtoMax: raw.cashback_avto_max ?? "",
  expired: raw.cashback_expired ?? "",
});

const toApi = (values: typeof defaultValues) => ({
  cashback_percent: values.cashbackPercent,
  cashback_max: values.cashbackMax,
  cashback_min: values.cashbackMin,
  cashback_balance: values.cashbackBalance,
  cashback_avto_max: values.cashbackAvtoMax,
  cashback_expired: values.expired,
});

const CashbackSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}><TextField name="cashbackPercent" item={{ label: "Cashback faizi" }} input={{ placeholder: "Cashback faizi daxil edin..." }} /></Col>
      <Col span={12}><TextField name="cashbackMax" item={{ label: "Cashback maksimum" }} input={{ placeholder: "Cashback maksimumunu daxil edin..." }} /></Col>
      <Col span={12}><TextField name="cashbackMin" item={{ label: "Cashback minimum" }} input={{ placeholder: "Cashback minimumunu daxil edin..." }} /></Col>
      <Col span={12}>
        <SelectField name="cashbackBalance" item={{ label: "Cashback balans" }} input={{ placeholder: "Cashback balansını seçin..." }}>
          <Select.Option value="try">TRY</Select.Option>
          <Select.Option value="usd">USD</Select.Option>
        </SelectField>
      </Col>
      <Col span={12}><TextField name="cashbackAvtoMax" item={{ label: "Təsdiqləmə limiti" }} input={{ placeholder: "Təsdiqləmə limitini daxil edin..." }} /></Col>
      <Col span={12}><TextField name="expired" item={{ label: "Gözləmə müddəti (gün)" }} input={{ placeholder: "Gözləmə müddəti daxil edin..." }} /></Col>
    </Row>
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
    </div>
  </Form>
);

export const CashbackSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("cashback", defaultValues, fromApi, toApi);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <CashbackSettingsForm {...f} />}
    </Formik>
  );
};
```

- [ ] **Commit:**

```bash
git add src/modules/system-settings/containers/cashback-settings.tsx
git commit -m "fix(system-settings): align CashbackSettings fields with delivery_management"
```

---

## Task 6: Rebuild `MailSettings` — template/banner fields

**Files:**
- Modify: `src/modules/system-settings/containers/mail-settings.tsx`

- [ ] **Replace the entire file:**

```tsx
import { FC, useMemo } from "react";
import { Button, Col, Form, Popover, Row, Spin, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { UploadField } from "@shared/modules/form/fields/upload";
import { useSettingsGroup } from "../hooks";

const { Text } = Typography;

const defaultValues = {
  ticketHtmlTemplateId: "",
  footerText: "",
  headerBannerUrl: "",
  rightBannerUrl: "",
  headerBannerPhoto: null as File | null,
  rightBannerPhoto: null as File | null,
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  ticketHtmlTemplateId: raw.ticket_html_template_id ?? "",
  footerText: raw.footer_text ?? "",
  headerBannerUrl: raw.header_banner_url ?? "",
  rightBannerUrl: raw.right_banner_url ?? "",
});

const toApi = (values: typeof defaultValues) => ({
  ticket_html_template_id: values.ticketHtmlTemplateId,
  footer_text: values.footerText,
  header_banner_url: values.headerBannerUrl,
  right_banner_url: values.rightBannerUrl,
  ...(values.headerBannerPhoto ? { header_banner_photo: values.headerBannerPhoto } : {}),
  ...(values.rightBannerPhoto ? { right_banner_photo: values.rightBannerPhoto } : {}),
});

const MailSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting, values }) => {
  const headerPreview = useMemo(() => <img src={values.headerBannerUrl || undefined} alt="Preview" width={100} height={100} />, [values.headerBannerUrl]);
  const rightPreview = useMemo(() => <img src={values.rightBannerUrl || undefined} alt="Preview" width={100} height={100} />, [values.rightBannerUrl]);

  return (
    <Form layout="vertical" component="div" size="large">
      <Row gutter={16}>
        <Col span={12}><TextField name="ticketHtmlTemplateId" item={{ label: "Müraciət şablonu", required: true }} input={{ placeholder: "Müraciət şablonu daxil edin..." }} /></Col>
        <Col span={12}><TextField name="footerText" item={{ label: "Footer mətni" }} input={{ placeholder: "Footer mətni daxil edin..." }} /></Col>
        <Col span={12}><TextField name="headerBannerUrl" item={{ label: "Başlıq banner URL-i", required: true }} input={{ placeholder: "Başlıq banner URL-i daxil edin..." }} /></Col>
        <Col span={12}><TextField name="rightBannerUrl" item={{ label: "Sağ banner URL-i", required: true }} input={{ placeholder: "Sağ banner URL-i daxil edin..." }} /></Col>
        <Col span={12}>
          <UploadField name="headerBannerPhoto" item={{ label: "Başlıq üçün şəkil yüklə" }} renderContent={() => (
            <Popover content={headerPreview} trigger="hover">
              <Button type="primary" icon={<DownloadOutlined />}>Şəkil yüklə</Button>
            </Popover>
          )} />
          <Text type="secondary">Tövsiyə edilən ölçü: 600x190</Text>
        </Col>
        <Col span={12}>
          <UploadField name="rightBannerPhoto" item={{ label: "Sağ banner üçün şəkil yüklə" }} renderContent={() => (
            <Popover content={rightPreview} trigger="hover">
              <Button type="primary" icon={<DownloadOutlined />}>Şəkil yüklə</Button>
            </Popover>
          )} />
          <Text type="secondary">Tövsiyə edilən ölçü: 200x250</Text>
        </Col>
      </Row>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
      </div>
    </Form>
  );
};

export const MailSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("email", defaultValues, fromApi, toApi);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <MailSettingsForm {...f} />}
    </Formik>
  );
};
```

- [ ] **Commit:**

```bash
git add src/modules/system-settings/containers/mail-settings.tsx
git commit -m "feat(system-settings): replace SMTP MailSettings with template/banner fields"
```

---

## Task 7: Add `AzerpostSettings` container

**Files:**
- Create: `src/modules/system-settings/containers/azerpost-settings.tsx`

- [ ] **Create the file:**

```tsx
import { FC } from "react";
import { Button, Col, Form, Row, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { useSettingsGroup } from "../hooks";

const defaultValues = {
  weightPrice: "",
  standardPrice: "",
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  weightPrice: raw.weight_price ?? "",
  standardPrice: raw.standart_price ?? "",
});

const toApi = (values: typeof defaultValues) => ({
  weight_price: values.weightPrice,
  standart_price: values.standardPrice,
});

const AzerpostSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}><TextField name="weightPrice" item={{ label: "KQ görə tarif" }} input={{ placeholder: "KQ görə tarif daxil edin..." }} /></Col>
      <Col span={12}><TextField name="standardPrice" item={{ label: "Standart tarif" }} input={{ placeholder: "Standart tarif daxil edin..." }} /></Col>
    </Row>
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
    </div>
  </Form>
);

export const AzerpostSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("azerpost", defaultValues, fromApi, toApi);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <AzerpostSettingsForm {...f} />}
    </Formik>
  );
};
```

- [ ] **Commit:**

```bash
git add src/modules/system-settings/containers/azerpost-settings.tsx
git commit -m "feat(system-settings): add AzerpostSettings container"
```

---

## Task 8: Add `TrendyolSettings` container

**Files:**
- Create: `src/modules/system-settings/containers/trendyol-settings.tsx`

- [ ] **Create the file:**

```tsx
import { FC } from "react";
import { Button, Col, Form, Row, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { useSettingsGroup } from "../hooks";

const defaultValues = {
  shippingCostUsd: "",
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  shippingCostUsd: raw.shipping_cost_usd?.toString() ?? "",
});

const toApi = (values: typeof defaultValues) => ({
  shipping_cost_usd: values.shippingCostUsd,
});

const TrendyolSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}>
        <TextField name="shippingCostUsd" item={{ label: "SC üçün çatdırılma haqqı" }} input={{ placeholder: "Məbləğ daxil edin...", addonAfter: "$" }} />
      </Col>
    </Row>
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
    </div>
  </Form>
);

export const TrendyolSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("trendyol", defaultValues, fromApi, toApi);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <TrendyolSettingsForm {...f} />}
    </Formik>
  );
};
```

- [ ] **Commit:**

```bash
git add src/modules/system-settings/containers/trendyol-settings.tsx
git commit -m "feat(system-settings): add TrendyolSettings container"
```

---

## Task 9: Add `TopupSettings` container

**Files:**
- Create: `src/modules/system-settings/containers/topup-settings.tsx`

- [ ] **Create the file:**

```tsx
import { FC } from "react";
import { Button, Col, Form, Row, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { SwitchField } from "@shared/modules/form/fields/switch";
import { useSettingsGroup } from "../hooks";

const defaultValues = {
  usdBalanceEnabled: false,
  tryBalanceEnabled: false,
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  usdBalanceEnabled: !!Number(raw.usd_balance_enabled ?? 0),
  tryBalanceEnabled: !!Number(raw.try_balance_enabled ?? 0),
});

const toApi = (values: typeof defaultValues) => ({
  usd_balance_enabled: values.usdBalanceEnabled ? "1" : "0",
  try_balance_enabled: values.tryBalanceEnabled ? "1" : "0",
});

const TopupSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}><SwitchField name="usdBalanceEnabled" item={{ label: "USD balans artımına icazə" }} /></Col>
      <Col span={12}><SwitchField name="tryBalanceEnabled" item={{ label: "TRY balans artımına icazə" }} /></Col>
    </Row>
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
    </div>
  </Form>
);

export const TopupSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("topup", defaultValues, fromApi, toApi);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <TopupSettingsForm {...f} />}
    </Formik>
  );
};
```

- [ ] **Commit:**

```bash
git add src/modules/system-settings/containers/topup-settings.tsx
git commit -m "feat(system-settings): add TopupSettings container"
```

---

## Task 10: Add `useCashboxes` hook + `CashflowSettings` container

**Files:**
- Create: `src/modules/system-settings/hooks/cashboxes/index.ts`
- Create: `src/modules/system-settings/containers/cashflow-settings.tsx`

- [ ] **Create the cashboxes hook** at `src/modules/system-settings/hooks/cashboxes/index.ts`:

```ts
import { useQuery } from "react-query";
import { ApiResult, caller, urlMaker } from "@shared/utils";

type ICashbox = { id: number; name: string };

const getCashboxes = async (): Promise<ApiResult<200, ICashbox[]> | ApiResult<400, string>> => {
  const url = urlMaker("/api/admin/cashboxes", { per_page: 1000 });
  try {
    const response = await caller(url);
    if (response.ok) {
      const result = await response.json();
      const items: ICashbox[] = (result.data || []).map((item: any) => ({ id: item.id, name: item.cashbox_name }));
      return new ApiResult(200, items, null);
    }
    return new ApiResult(400, "Kassalar əldə edilə bilmədi", null);
  } catch {
    return new ApiResult(400, "Şəbəkə xətası.", null);
  }
};

export const useCashboxes = () =>
  useQuery(["cashboxes"], async () => {
    const result = await getCashboxes();
    if (result.status === 200) return result.data;
    throw new Error(result.data as string);
  }, { staleTime: 5 * 60 * 1000 });
```

- [ ] **Create `CashflowSettings`** at `src/modules/system-settings/containers/cashflow-settings.tsx`:

```tsx
import { FC } from "react";
import { Button, Col, Form, Row, Select, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { SelectField } from "@shared/modules/form/fields/select";
import { useSettingsGroup } from "../hooks";
import { useCashboxes } from "../hooks/cashboxes";

const defaultValues = {
  cashboxId: "",
  terminalCashboxId: "",
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  cashboxId: raw.cashbox_id ?? "",
  terminalCashboxId: raw.terminal_cashbox_id ?? "",
});

const toApi = (values: typeof defaultValues) => ({
  cashbox_id: values.cashboxId,
  terminal_cashbox_id: values.terminalCashboxId,
});

const CashflowSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => {
  const cashboxes = useCashboxes();

  return (
    <Form layout="vertical" component="div" size="large">
      <Row gutter={16}>
        <Col span={12}>
          <SelectField name="cashboxId" item={{ label: "Sifariş kassası" }} input={{ placeholder: "Sifariş kassasını seçin...", loading: cashboxes.isLoading }}>
            {(cashboxes.data ?? []).map((c) => (
              <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>
            ))}
          </SelectField>
        </Col>
        <Col span={12}>
          <SelectField name="terminalCashboxId" item={{ label: "Terminal kassası" }} input={{ placeholder: "Terminal kassasını seçin...", loading: cashboxes.isLoading }}>
            {(cashboxes.data ?? []).map((c) => (
              <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>
            ))}
          </SelectField>
        </Col>
      </Row>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
      </div>
    </Form>
  );
};

export const CashflowSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("cashflow", defaultValues, fromApi, toApi);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <CashflowSettingsForm {...f} />}
    </Formik>
  );
};
```

- [ ] **Commit:**

```bash
git add src/modules/system-settings/hooks/cashboxes/index.ts src/modules/system-settings/containers/cashflow-settings.tsx
git commit -m "feat(system-settings): add cashboxes hook and CashflowSettings container"
```

---

## Task 11: Update hooks barrel, containers barrel, and page

**Files:**
- Modify: `src/modules/system-settings/hooks/index.ts`
- Modify: `src/modules/system-settings/containers/index.ts`
- Modify: `src/modules/system-settings/pages/index.tsx`

- [ ] **Update `src/modules/system-settings/hooks/index.ts`** — add cashboxes export:

```ts
export * from './settings';
export * from './cashboxes';
```

- [ ] **Update `src/modules/system-settings/containers/index.ts`** — add all new containers:

```ts
export { OthersSettings } from "./others-settings";
export { CashbackSettings } from "./cashback-settings";
export { MailSettings } from "./mail-settings";
export { AzerpostSettings } from "./azerpost-settings";
export { TrendyolSettings } from "./trendyol-settings";
export { TopupSettings } from "./topup-settings";
export { CashflowSettings } from "./cashflow-settings";
```

- [ ] **Update `src/modules/system-settings/pages/index.tsx`** — add all panels:

```tsx
import { FC, useState } from "react";
import { Collapse } from "antd";
import { PageContent } from "@shared/styled/page-content";
import { OthersSettings, CashbackSettings, MailSettings, AzerpostSettings, TrendyolSettings, TopupSettings, CashflowSettings } from "../containers";

type SettingKey = "cashflow" | "cashback" | "azerpost" | "email" | "trendyol" | "topup" | "others";

export const SystemSettingsPage: FC = () => {
  const [activeKeys, setActiveKeys] = useState<SettingKey[]>(["cashflow"]);

  return (
    <PageContent $contain={true}>
      <Collapse
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(Array.isArray(keys) ? (keys as SettingKey[]) : [keys as SettingKey])}
      >
        <Collapse.Panel header="Cashflow tənzimləmələri" key="cashflow">
          {activeKeys.includes("cashflow") && <CashflowSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Kəşbək tənzimləmələri" key="cashback">
          {activeKeys.includes("cashback") && <CashbackSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Azərpoçt tarifləri" key="azerpost">
          {activeKeys.includes("azerpost") && <AzerpostSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Mail tənzimləmələri" key="email">
          {activeKeys.includes("email") && <MailSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Trendyol tənzimləmələri" key="trendyol">
          {activeKeys.includes("trendyol") && <TrendyolSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Balans artımına icazə" key="topup">
          {activeKeys.includes("topup") && <TopupSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Digər tənzimləmələr" key="others">
          {activeKeys.includes("others") && <OthersSettings />}
        </Collapse.Panel>
      </Collapse>
    </PageContent>
  );
};
```

- [ ] **Commit:**

```bash
git add src/modules/system-settings/hooks/index.ts src/modules/system-settings/containers/index.ts src/modules/system-settings/pages/index.tsx
git commit -m "feat(system-settings): register all new settings sections in barrel and page"
```
