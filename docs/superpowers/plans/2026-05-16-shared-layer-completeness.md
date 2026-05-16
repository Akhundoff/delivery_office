# Shared Layer Completeness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `src/shared/` in `delivery_management_new` to full parity with `delivery_warehouse`, adding all missing hooks, utilities, form fields, styled components, and sub-modules in three tiers.

**Architecture:** Tier 1 fixes critical correctness issues (lang header, skip-first-fetch in NextTableProvider, search-params hook). Tier 2 fills structural gaps (URL helpers, utils, form fields, antd helpers, table cells). Tier 3 adds enhancement components (styled, antd styled, portal, icons, progress, rating). Each tier is committed independently.

**Tech Stack:** React 18, TypeScript, Ant Design v5, styled-components, formik, dayjs, `flat` v6, `shallow-equal` v3, `polished`, `@ant-design/icons` v5, `@ant-design/pro-components` v2.

**Verification command (no test suite — use TypeScript):**
```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output (zero errors).

---

## TIER 1 — Critical Fixes

---

### Task 1: Fix `caller.ts` — hardcoded lang

**Files:**
- Modify: `src/shared/utils/caller.ts:9`

- [ ] **Step 1: Edit the file**

In `src/shared/utils/caller.ts`, change line 9:

```typescript
import Cookies from 'js-cookie';

export const caller = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  const accessToken: string | null = Cookies.get('accessToken') || null;

  const additionalHeaders: HeadersInit = {
    Accept: 'application/json',
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
    lang: localStorage.getItem('i18nextLng') || 'az',
  };

  const countryId = localStorage.getItem('warehouse.country_id');
  if (countryId) {
    additionalHeaders['country-id'] = countryId;
  }

  const finalInit: RequestInit = {
    ...init,
    headers: {
      ...(init ? init.headers : {}),
      ...additionalHeaders,
    },
  };

  return fetch(input, finalInit);
};
```

- [ ] **Step 2: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/shared/utils/caller.ts
git commit -m "fix: read lang from localStorage in caller instead of hardcoding 'az'"
```

---

### Task 2: Add `useSkipEffect` hook

**Files:**
- Create: `src/shared/hooks/use-skip-effect.ts`
- Modify: `src/shared/hooks/index.ts`

- [ ] **Step 1: Create `src/shared/hooks/use-skip-effect.ts`**

```typescript
import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export const useSkipEffect = (effect: EffectCallback, deps: DependencyList): void => {
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
```

- [ ] **Step 2: Update `src/shared/hooks/index.ts`**

```typescript
export { useDebounceEffect } from './use-debounce-effect';
export { useBackgroundNavigate } from './use-background-navigate';
export { useCloseModal } from './use-close-modal';
export { useSkipEffect } from './use-skip-effect';
```

(`useSearchParams` will be added to this barrel in Task 3, once its file exists.)

- [ ] **Step 3: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

---

### Task 3: Add `useSearchParams` hook

**Files:**
- Create: `src/shared/hooks/use-search-params.ts`

- [ ] **Step 1: Create `src/shared/hooks/use-search-params.ts`**

```typescript
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';
import { useBackgroundNavigate } from './use-background-navigate';

export const useSearchParams = <T = Record<string, string>>() => {
  const remove = useRef<(name: string) => void>(() => {});
  const location = useLocation();
  const navigate = useBackgroundNavigate();

  const searchParams = useMemo<T>(() => {
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(params.entries()) as unknown as T;
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    remove.current = (name: string) => {
      params.delete(name);
      navigate({ pathname: '', search: params.toString() });
    };
  }, [navigate, location.search]);

  return { searchParams, remove };
};
```

- [ ] **Step 2: Add `useSearchParams` to `src/shared/hooks/index.ts`**

```typescript
export { useDebounceEffect } from './use-debounce-effect';
export { useBackgroundNavigate } from './use-background-navigate';
export { useCloseModal } from './use-close-modal';
export { useSkipEffect } from './use-skip-effect';
export { useSearchParams } from './use-search-params';
```

**Usage pattern (for every list module that needs post-modal refetch):**
```typescript
// In a list hook, e.g. hooks/declarations/use-declarations-table.ts
const { searchParams, remove } = useSearchParams<{ reFetchDeclarationsTable?: string }>();

useEffect(() => {
  (async () => {
    if (searchParams.reFetchDeclarationsTable) {
      remove.current('reFetchDeclarationsTable');
      await handleFetch();
    }
  })();
}, [handleFetch, remove, searchParams.reFetchDeclarationsTable]);
```

**How to trigger refetch from a modal (e.g. after create success):**
```typescript
// In a modal form hook, after successful API call:
navigate(localURLMaker('/declarations', {}, { reFetchDeclarationsTable: '1' }));
```

- [ ] **Step 2: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/shared/hooks/use-skip-effect.ts src/shared/hooks/use-search-params.ts src/shared/hooks/index.ts
git commit -m "feat: add useSkipEffect and useSearchParams hooks"
```

---

### Task 4: Add `skipFetch` prop to `NextTableProvider`

**Files:**
- Modify: `src/shared/modules/next-table/context/provider.tsx`

- [ ] **Step 1: Rewrite `src/shared/modules/next-table/context/provider.tsx`**

```typescript
import React, { Context, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { nextTableReducer, nextTableState } from './reducer';
import { NextTableContext, NextTableState } from '../types';
import {
  nextTableResetAction, nextTableSelectAllAction, nextTableSetFiltersAction,
  nextTableSetFiltersByIdAction, nextTableSetPageIndexAction, nextTableSetPageSizeAction,
  nextTableSetSelectedRowIdsAction, nextTableSetSortByAction,
} from './actions';
import { TableCacheContext } from './table-cache';
import { NextTableActions } from './action-types';
import { useDebounceEffect } from '@shared/hooks';

export const NextTableProvider: FC<PropsWithChildren<{
  context: Context<NextTableContext>;
  onFetch: Function;
  name?: string;
  useCache?: boolean;
  defaultState?: Partial<NextTableState>;
  skipFetch?: boolean;
}>> = ({ children, context, onFetch, name, useCache = true, defaultState, skipFetch }) => {
  const tableCache = useContext(TableCacheContext);
  const cachedState = useMemo(() => (name && tableCache.get(name)) || {}, [name, tableCache]);
  const [state, baseDispatch] = useReducer(
    nextTableReducer,
    useCache ? { ...nextTableState, ...defaultState, ...cachedState } : { ...nextTableState, ...defaultState },
  );
  const mounted = useRef(true);
  const skipFirstFetchRef = useRef(skipFetch ?? false);

  const dispatch = useCallback<React.Dispatch<NextTableActions>>((action) => {
    if (mounted.current) baseDispatch(action);
  }, []);

  const handleChangeFilters = useCallback((filters) => dispatch(nextTableSetFiltersAction(filters)), [dispatch]);
  const handleChangeFilterById = useCallback((id: string, value: any) => dispatch(nextTableSetFiltersByIdAction(id, value)), [dispatch]);
  const handleChangeSortBy = useCallback((sortBy) => dispatch(nextTableSetSortByAction(sortBy)), [dispatch]);
  const handleChangePageIndex = useCallback((pageIndex) => dispatch(nextTableSetPageIndexAction(pageIndex)), [dispatch]);
  const handleChangePageSize = useCallback((pageSize) => dispatch(nextTableSetPageSizeAction(pageSize)), [dispatch]);
  const handleChangeSelectedRowIds = useCallback((selectedRowIds) => dispatch(nextTableSetSelectedRowIdsAction(selectedRowIds)), [dispatch]);

  const handleFetch = useCallback(() => {
    onFetch({ filters: state.filters, sortBy: state.sortBy, pageIndex: state.pageIndex, pageSize: state.pageSize })(dispatch);
  }, [dispatch, onFetch, state.filters, state.pageIndex, state.pageSize, state.sortBy]);

  const handleReset = useCallback(() => dispatch(nextTableResetAction()), [dispatch]);
  const handleSelectAll = useCallback(() => dispatch(nextTableSelectAllAction()), [dispatch]);
  const handleResetSelection = useCallback(() => dispatch(nextTableSetSelectedRowIdsAction({})), [dispatch]);

  useDebounceEffect(
    useCallback(() => {
      if (skipFirstFetchRef.current) {
        skipFirstFetchRef.current = false;
        return;
      }
      handleFetch();
    }, [handleFetch]),
    300,
  );

  useEffect(() => {
    if (name && useCache) tableCache.set(name, state);
  }, [name, useCache, tableCache, state]);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  const value = useMemo<NextTableContext>(
    () => ({
      state, dispatch, handleChangeFilters, handleChangeSortBy, handleChangePageIndex,
      handleChangePageSize, handleChangeSelectedRowIds, handleFetch, handleReset,
      handleResetSelection, handleSelectAll, handleChangeFilterById,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
};
```

- [ ] **Step 2: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/shared/modules/next-table/context/provider.tsx
git commit -m "feat: add skipFetch prop to NextTableProvider — skips initial auto-fetch on mount"
```

---

## TIER 2 — Structural Gaps

---

### Task 5: Extend `url-maker.ts` with `localURLMaker` and `staticFileUrl`

**Files:**
- Modify: `src/shared/utils/url-maker.ts`

- [ ] **Step 1: Rewrite `src/shared/utils/url-maker.ts`**

```typescript
import { object2Search } from './object-to-search';

export const urlMaker = (pathname: string, params: Record<string, unknown> = {}) => {
  const host: string = process.env.REACT_APP_API_HOST || '';
  const queryParams: string = object2Search(params);
  return host + pathname + queryParams;
};

export const localURLMaker = (pathname: string, params: Record<string, string | number> = {}, query: Record<string, any> = {}) => {
  const filledPathname = Object.entries(params)
    .filter(([, value]) => !!value)
    .reduce((acc, [key, value]) => acc.replace(':' + key, value.toString()), pathname);

  const queryString = object2Search(query);
  return filledPathname + queryString;
};

export const staticFileUrl = (fileName: string): string => {
  return urlMaker(localURLMaker('/storage/files/:fileName', { fileName }));
};
```

- [ ] **Step 2: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/shared/utils/url-maker.ts
git commit -m "feat: add localURLMaker and staticFileUrl to url-maker utils"
```

---

### Task 6: Add utility files — batch 1 (`formDataFlat`, `sanitizeObject`, `appendToFormData`, `getBase64`)

**Files:**
- Create: `src/shared/utils/form-data-flat.ts`
- Create: `src/shared/utils/sanitize-object.ts`
- Create: `src/shared/utils/apply-to-form-data.ts`
- Create: `src/shared/utils/get-base-64.ts`

- [ ] **Step 1: Create `src/shared/utils/form-data-flat.ts`**

```typescript
import { flatten } from 'flat';

export const formDataFlat = <Output extends object>(object: Record<string, any>): Output => {
  const flattened = flatten<Record<string, any>, Record<string, any>>(object);

  const connectorsChanged = Object.entries(flattened).reduce((acc, [key, value]) => {
    const finalKey = key.split('.').reduce((a, val, index) => a + (index ? '[' + val + ']' : val), '');
    return { ...acc, [finalKey]: value };
  }, {});

  return Object.entries(connectorsChanged).reduce((acc, [key, value]) => {
    if (value === undefined || value === null || value instanceof Array) return acc;

    const finalEntry: Record<string, string> = {};
    if (typeof value === 'number') {
      finalEntry[key] = value.toString();
    } else if (typeof value === 'boolean') {
      finalEntry[key] = Number(value).toString();
    } else {
      finalEntry[key] = value;
    }
    return { ...acc, ...finalEntry };
  }, {}) as Output;
};
```

- [ ] **Step 2: Create `src/shared/utils/sanitize-object.ts`**

```typescript
export const sanitizeObject = <ObjectType extends object>(
  object: ObjectType,
  sanitizedValues: (string | number | undefined | null)[],
): ObjectType => {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (sanitizedValues.includes(value)) return acc;
    return { ...acc, [key]: value };
  }, {}) as ObjectType;
};
```

- [ ] **Step 3: Create `src/shared/utils/apply-to-form-data.ts`**

```typescript
export const appendToFormData = <ObjectType extends Record<string, any> = Record<string, any>>(object: ObjectType, formData: FormData) => {
  Object.entries(object)
    .filter(([, value]) => !!value)
    .forEach(([key, value]) => formData.append(key, value));
};
```

- [ ] **Step 4: Create `src/shared/utils/get-base-64.ts`**

```typescript
export const getBase64 = (file: File): Promise<string | null> => {
  return new Promise<string | null>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve(null);
  });
};
```

- [ ] **Step 5: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/shared/utils/form-data-flat.ts src/shared/utils/sanitize-object.ts src/shared/utils/apply-to-form-data.ts src/shared/utils/get-base-64.ts
git commit -m "feat: add formDataFlat, sanitizeObject, appendToFormData, getBase64 utilities"
```

---

### Task 7: Add utility files — batch 2 (`InputFormatters`, `twoLevelShallowEqualObject`, `stopPropagation`) + update barrel

**Files:**
- Create: `src/shared/utils/input-formatters.ts`
- Create: `src/shared/utils/two-level-shallow-equal-object.ts`
- Create: `src/shared/utils/stop-propagation.ts`
- Modify: `src/shared/utils/index.ts`

- [ ] **Step 1: Create `src/shared/utils/input-formatters.ts`**

```typescript
import { ChangeEvent } from 'react';

export class InputFormatters {
  public static decimal(event: ChangeEvent<HTMLInputElement>): ChangeEvent<HTMLInputElement> {
    event.target.value = event.target.value.replace(/,/g, '.');
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
    return event;
  }

  public static integer(event: ChangeEvent<HTMLInputElement>): ChangeEvent<HTMLInputElement> {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    return event;
  }
}
```

- [ ] **Step 2: Create `src/shared/utils/two-level-shallow-equal-object.ts`**

```typescript
import { shallowEqualObjects } from 'shallow-equal';

export const twoLevelShallowEqualObject = (prevObject: object, currObject: object): boolean => {
  for (const key in prevObject) {
    if (prevObject.hasOwnProperty(key) && currObject.hasOwnProperty(key)) {
      if (!shallowEqualObjects(prevObject[key], currObject[key])) return false;
    } else {
      return false;
    }
  }
  return true;
};
```

- [ ] **Step 3: Create `src/shared/utils/stop-propagation.ts`**

```typescript
import { MouseEvent } from 'react';

export const stopPropagation = (cb?: (event: MouseEvent) => void) => (event: MouseEvent) => {
  event.stopPropagation();
  return cb ? cb(event) : undefined;
};
```

- [ ] **Step 4: Update `src/shared/utils/index.ts`**

```typescript
export * from './api-result';
export * from './caller';
export * from './object-to-search';
export * from './url-maker';
export * from './form-data-flat';
export * from './sanitize-object';
export * from './apply-to-form-data';
export * from './get-base-64';
export * from './input-formatters';
export * from './two-level-shallow-equal-object';
export * from './stop-propagation';
```

- [ ] **Step 5: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/shared/utils/input-formatters.ts src/shared/utils/two-level-shallow-equal-object.ts src/shared/utils/stop-propagation.ts src/shared/utils/index.ts
git commit -m "feat: add InputFormatters, twoLevelShallowEqualObject, stopPropagation utilities"
```

---

### Task 8: Add `helpers/` directory with `baseErrorParser`

**Files:**
- Create: `src/shared/helpers/index.ts`

- [ ] **Step 1: Create `src/shared/helpers/index.ts`**

```typescript
export const baseErrorParser = (errors: Record<string, string[]>): string[] => {
  return Object.values(errors).flat();
};
```

- [ ] **Step 2: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/shared/helpers/index.ts
git commit -m "feat: add helpers directory with baseErrorParser"
```

---

### Task 9: Add form fields — `SwitchField` and `MultiUploadField`

**Files:**
- Create: `src/shared/modules/form/fields/switch.tsx`
- Create: `src/shared/modules/form/fields/multi-upload.tsx`
- Modify: `src/shared/modules/form/index.ts`

Note: Both fields use `twoLevelShallowEqualObject` from `@shared/utils` (added in Task 7).

- [ ] **Step 1: Create `src/shared/modules/form/fields/switch.tsx`**

```typescript
import React, { FC, memo, useCallback, useMemo } from 'react';
import { Form, Switch } from 'antd';
import { FormItemProps } from 'antd/es/form';
import { FieldHookConfig, useField } from 'formik';
import { SwitchProps } from 'antd/es/switch';
import { twoLevelShallowEqualObject } from '@shared/utils';

export type SwitchFieldProps = FieldHookConfig<boolean> & {
  item?: FormItemProps;
  input?: SwitchProps;
};

type MemoizedSwitchFieldProps = {
  item?: FormItemProps;
  input?: SwitchProps;
  field: any;
  meta: any;
};

const MemoizedSwitchField = memo<MemoizedSwitchFieldProps>(({ meta, item, field, input }) => {
  return (
    <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.error}>
      <Switch {...field} {...input} />
    </Form.Item>
  );
}, twoLevelShallowEqualObject);

export const SwitchField: FC<SwitchFieldProps> = ({ item, input, ...props }) => {
  const [{ onChange: baseOnChange, ...field }, meta] = useField({ ...props, type: 'checkbox' });

  const onChange = useCallback(
    (value: boolean) => {
      baseOnChange(field.name)({ target: { type: 'checkbox', checked: value } } as any);
    },
    [baseOnChange, field.name],
  );

  const newField = useMemo(() => ({ ...field, onChange }), [field, onChange]);

  return <MemoizedSwitchField field={newField} meta={meta} input={input} item={item} />;
};
```

- [ ] **Step 2: Create `src/shared/modules/form/fields/multi-upload.tsx`**

```typescript
import React, { FC, memo, PropsWithChildren, useCallback, useMemo } from 'react';
import { FieldHookConfig, FieldMetaProps, useField } from 'formik';
import { Form, Upload } from 'antd';
import { FormItemProps } from 'antd/es/form';
import { UploadChangeParam, UploadProps } from 'antd/es/upload';
import { twoLevelShallowEqualObject } from '@shared/utils';

export type MultiUploadFieldProps = FieldHookConfig<File[]> & {
  item?: FormItemProps;
  input?: UploadProps;
};

type MemoizedMultiUploadFieldProps = {
  item?: FormItemProps;
  input?: UploadProps;
  field: any;
  meta: FieldMetaProps<any>;
};

const MemoizedMultiUploadField = memo<PropsWithChildren<MemoizedMultiUploadFieldProps>>(({ item, input, field, meta, children }) => {
  const internalUploadProps = useMemo(() => ({ beforeUpload: () => false }), []);

  return (
    <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.error}>
      <Upload {...internalUploadProps} {...field} {...input}>
        {children}
      </Upload>
    </Form.Item>
  );
}, twoLevelShallowEqualObject);

export const MultiUploadField: FC<MultiUploadFieldProps> = ({ item, input, children, ...props }) => {
  const [{ onChange: baseOnChange, ...field }, meta] = useField<File[]>(props);

  const onChange = useCallback(
    (params: UploadChangeParam) => {
      baseOnChange(field.name)({ target: { type: 'text', value: params.fileList } } as any);
    },
    [baseOnChange, field.name],
  );

  const newField = useMemo(() => ({ onChange, fileList: field.value }), [field.value, onChange]);

  return <MemoizedMultiUploadField field={newField} meta={meta} item={item} input={input} children={children} />;
};
```

- [ ] **Step 3: Update `src/shared/modules/form/index.ts`**

```typescript
export { TextField } from './fields/text';
export { SelectField } from './fields/select';
export { DateField } from './fields/date';
export { CheckboxField } from './fields/checkbox';
export { RadioField } from './fields/radio';
export { TextAreaField } from './fields/textarea';
export { UploadField } from './fields/upload';
export { RichTextField } from './fields/rich-text';
export { SwitchField } from './fields/switch';
export { MultiUploadField } from './fields/multi-upload';
```

- [ ] **Step 4: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/shared/modules/form/fields/switch.tsx src/shared/modules/form/fields/multi-upload.tsx src/shared/modules/form/index.ts
git commit -m "feat: add SwitchField and MultiUploadField form fields"
```

---

### Task 10: Add two antd filter strategies

**Files:**
- Modify: `src/shared/modules/antd/helpers/filter-option.ts`

- [ ] **Step 1: Rewrite `src/shared/modules/antd/helpers/filter-option.ts`**

```typescript
export const filterOption = (input: string, option: any) => {
  if (typeof option?.children === 'string') {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  } else if (Array.isArray(option?.children)) {
    return option.children.join('').toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  return false;
};

export const filterOptionWithNameOrId = (input: string, option: any) => {
  const parsedInput = parseInt(input.toLowerCase());
  if (typeof option?.children === 'string') {
    return Number.isNaN(parsedInput)
      ? option.children.toLowerCase().split(' ')[3]?.includes(input.toLowerCase()) ?? false
      : option.children.toLowerCase().split(' ')[1]?.includes(parsedInput.toString()) ?? false;
  } else if (Array.isArray(option?.children)) {
    return Number.isNaN(parsedInput)
      ? option.children[option.children.length - 1]?.toLowerCase().includes(input.toLowerCase()) ?? false
      : option.children[1]?.toString().toLowerCase().startsWith(parsedInput.toString()) ?? false;
  }
  return false;
};

export const filterOptionStart = (input: string, option: any) => {
  if (typeof option?.children === 'string') {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) === 1;
  } else if (Array.isArray(option?.children)) {
    return option.children.join('').toLowerCase().indexOf(input.toLowerCase()) === 1;
  }
  return false;
};
```

- [ ] **Step 2: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/shared/modules/antd/helpers/filter-option.ts
git commit -m "feat: add filterOptionWithNameOrId and filterOptionStart antd select strategies"
```

---

### Task 11: Add next-table cells — `NextTableCheckCell` and `NextTablePriceCell`

**Files:**
- Create: `src/shared/modules/next-table/components/cells/check.tsx`
- Create: `src/shared/modules/next-table/components/cells/price.tsx`
- Modify: `src/shared/modules/next-table/hooks/index.ts`

- [ ] **Step 1: Create `src/shared/modules/next-table/components/cells/check.tsx`**

```typescript
import React, { FC, memo, useMemo } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { green, red } from '@ant-design/colors';

export const NextTableCheckCell: FC<any> = memo<any>(({ cell: { value } }) => {
  const wrapperProps = useMemo(
    () => ({
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flex: 1,
      },
    }),
    [],
  );

  return (
    <div {...wrapperProps}>
      {!!value ? (
        <CheckOutlined style={{ color: green[5] }} />
      ) : (
        <CloseOutlined style={{ color: red[5] }} />
      )}
    </div>
  );
});
```

- [ ] **Step 2: Create `src/shared/modules/next-table/components/cells/price.tsx`**

```typescript
import React, { FC, memo } from 'react';

const TRY: FC<any> = ({ cell: { value } }) => (value ? <span>{value} &#8378;</span> : null);
const USD: FC<any> = ({ cell: { value } }) => (value ? <span>{value} &#36;</span> : null);
const AZN: FC<any> = ({ cell: { value } }) => (value ? <span>{value} &#8380;</span> : null);

const Auto: FC<any> = ({ cell: { value }, row: { original } }) => {
  switch (original.currency) {
    case 'TRY': return <span>{value} &#8378;</span>;
    case 'USD': return <span>{value} &#36;</span>;
    case 'AZN': return <span>{value} &#8380;</span>;
    default: return null;
  }
};

export const NextTablePriceCell = {
  TRY: memo<any>(TRY),
  USD: memo<any>(USD),
  AZN: memo<any>(AZN),
  Auto: memo<any>(Auto),
};
```

- [ ] **Step 3: Check if next-table has a barrel export for cells — if not, exports are used via direct import path**

```bash
cat src/shared/modules/next-table/hooks/index.ts
```

Cells are consumed directly in column definition files:
```typescript
// In a module's use-xxx-table-columns.tsx:
import { NextTableCheckCell } from '@shared/modules/next-table/components/cells/check';
import { NextTablePriceCell } from '@shared/modules/next-table/components/cells/price';
```

- [ ] **Step 4: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/shared/modules/next-table/components/cells/check.tsx src/shared/modules/next-table/components/cells/price.tsx
git commit -m "feat: add NextTableCheckCell and NextTablePriceCell to next-table"
```

---

## TIER 3 — Enhancements

---

### Task 12: Add styled components

**Files:**
- Create: `src/shared/styled/centered-container.tsx`
- Create: `src/shared/styled/no.tsx`
- Create: `src/shared/styled/space.tsx`
- Create: `src/shared/styled/file-link.tsx`
- Create: `src/shared/styled/tag-space.tsx`
- Create: `src/shared/styled/utils.tsx`

- [ ] **Step 1: Create `src/shared/styled/centered-container.tsx`**

```typescript
import styled from 'styled-components';

export const CenteredContainer = styled.div<{ $maxWidth: string }>`
  max-width: ${({ $maxWidth = 'auto' }) => $maxWidth};
  width: 100%;
  margin: 0 auto;
`;
```

- [ ] **Step 2: Create `src/shared/styled/no.tsx`**

```typescript
import styled from 'styled-components';

const Button = styled.button`
  background: transparent;
  box-shadow: 0 0 0 transparent;
  border: 0 solid transparent;
  text-shadow: 0 0 0 transparent;
  padding: 0;
  margin: 0;

  &:hover {
    background: transparent;
    box-shadow: 0 0 0 transparent;
    border: 0 solid transparent;
    text-shadow: 0 0 0 transparent;
  }

  &:active {
    outline: none;
    border: none;
  }

  &:focus {
    outline: 0;
  }
`;

export const NoUI = { Button };
```

- [ ] **Step 3: Create `src/shared/styled/space.tsx`**

```typescript
import styled from 'styled-components';

export const Space = styled.div<{ $size: number; $direction?: 'horizontal' | 'vertical' }>`
  display: ${({ $direction = 'vertical' }) => ($direction === 'vertical' ? 'block' : 'flex')};
  flex-wrap: wrap;

  [role='wrapped-button'] {
    white-space: normal;
    height: auto;
  }

  & > * {
    margin-right: ${({ $size, $direction = 'vertical' }) => $direction === 'horizontal' && $size}px;
    margin-bottom: ${({ $size, $direction = 'vertical' }) => $direction === 'vertical' && $size}px;
  }
`;
```

- [ ] **Step 4: Create `src/shared/styled/file-link.tsx`**

Uses `Theme.colors.primary` from the new project's theme (`#1da57a`).

```typescript
import styled from 'styled-components';
import { rgba } from 'polished';
import { Theme } from '../theme';

export const FileLink = styled.a.attrs({ target: '_blank', rel: 'noreferrer noopener' })`
  font-size: 13px;
  display: inline-block;
  color: ${Theme.colors.primary};
  border: 1px solid ${Theme.colors.primary};
  background-color: ${rgba(Theme.colors.primary, 0.05)};
  border-radius: 2px;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.25rem;
  margin-right: 0.5rem;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    text-decoration: none;
    background-color: ${Theme.colors.primary};
    color: ${Theme.colors.white};
  }
`;
```

- [ ] **Step 5: Create `src/shared/styled/tag-space.tsx`**

```typescript
import styled from 'styled-components';
import { Space } from 'antd';

export const TagSpace = styled(Space)`
  .ant-space-item {
    display: flex;
  }
`;
```

- [ ] **Step 6: Create `src/shared/styled/utils.tsx`**

```typescript
import styled from 'styled-components';

export const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const Flex = styled.div<{ $expandNthChild?: number; $align?: string; $justify?: string }>`
  display: flex;
  align-items: ${({ $align = 'flex-start' }) => $align};
  justify-content: ${({ $justify = 'flex-start' }) => $justify};

  & > *:nth-child(${({ $expandNthChild = 1 }) => $expandNthChild}) {
    flex: 1;
  }
`;
```

- [ ] **Step 7: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add src/shared/styled/centered-container.tsx src/shared/styled/no.tsx src/shared/styled/space.tsx src/shared/styled/file-link.tsx src/shared/styled/tag-space.tsx src/shared/styled/utils.tsx
git commit -m "feat: add CenteredContainer, NoUI, Space, FileLink, TagSpace, Center/Flex styled components"
```

---

### Task 13: Add antd styled components and `TooltipLabel`

**Files:**
- Create: `src/shared/modules/antd/styled/descriptions.tsx`
- Create: `src/shared/modules/antd/styled/page-header.tsx`
- Create: `src/shared/modules/antd/styled/tabs.tsx`
- Create: `src/shared/modules/antd/components/tooltip-label.tsx`

- [ ] **Step 1: Create `src/shared/modules/antd/styled/descriptions.tsx`**

```typescript
import styled from 'styled-components';
import { Descriptions } from 'antd';

export const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-header {
    margin-bottom: 8px;
  }

  .ant-descriptions-title {
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
  }
`;
```

- [ ] **Step 2: Create `src/shared/modules/antd/styled/page-header.tsx`**

```typescript
import styled from 'styled-components';
import { PageContainer } from '@ant-design/pro-components';

export const StyledPageHeader = styled(PageContainer)`
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;

  .ant-page-header-heading-left,
  .ant-page-header-heading-extra {
    margin: 0;
  }

  .ant-page-header-heading-title {
    font-size: 16px;
    font-weight: 500;
  }

  .ant-page-header-heading-extra > * {
    margin-left: 0;
  }
`;
```

- [ ] **Step 3: Create `src/shared/modules/antd/styled/tabs.tsx`**

```typescript
import styled, { css } from 'styled-components';
import { Tabs } from 'antd';
import { TabsPosition } from 'antd/es/tabs';

const tabPositionLeftStyle = css`
  border: 1px solid #f0f0f0;
  background-color: #fafafa;

  .ant-tabs-nav {
    background-color: #fafafa;
    max-width: 340px;
    border-right: 1px solid #f0f0f0;
  }

  .ant-tabs-tabpane {
    padding-left: 0 !important;
  }

  .ant-tabs-tab {
    margin-bottom: 0 !important;

    .ant-tabs-tab-btn {
      text-align: left;
      white-space: normal;
    }

    &:not(:nth-last-child(2)) {
      border-bottom: 1px solid #f0f0f0;
    }
  }
`;

const tabPositionTopStyle = css`
  .ant-tabs-nav {
    border-left: 1px solid #f0f0f0;
    border-top: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
    background-color: #fafafa;
  }

  .ant-tabs-tab {
    padding-left: 12px;
    padding-right: 12px;
    margin-right: 0;
  }

  .ant-tabs-extra-content > .ant-btn-icon-only {
    min-width: 42px;
  }
`;

export const StyledTabs = styled(Tabs)<{ tabPosition?: TabsPosition }>`
  min-height: 256px;

  ${({ tabPosition = 'top' }) => {
    switch (tabPosition) {
      case 'left':
        return tabPositionLeftStyle;
      case 'top':
        return tabPositionTopStyle;
      default:
        return css``;
    }
  }}
`;
```

- [ ] **Step 4: Create `src/shared/modules/antd/components/tooltip-label.tsx`**

```typescript
import React, { FC } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const TooltipLabel: FC<{ label: string; message: string }> = ({ label, message }) => {
  return (
    <span>
      {label}&nbsp;
      <Tooltip title={message}>
        <QuestionCircleOutlined />
      </Tooltip>
    </span>
  );
};
```

- [ ] **Step 5: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/shared/modules/antd/styled/descriptions.tsx src/shared/modules/antd/styled/page-header.tsx src/shared/modules/antd/styled/tabs.tsx src/shared/modules/antd/components/tooltip-label.tsx
git commit -m "feat: add StyledDescriptions, StyledPageHeader, StyledTabs, TooltipLabel antd components"
```

---

### Task 14: Add `Portal` and `icons` shared components

**Files:**
- Create: `src/shared/components/portal.tsx`
- Create: `src/shared/components/icons.tsx`

- [ ] **Step 1: Create `src/shared/components/portal.tsx`**

```typescript
import { createPortal } from 'react-dom';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';

export const Portal: FC<PropsWithChildren> = ({ children }) => {
  const containerElementRef = useRef(document.createElement('div'));

  useEffect(() => {
    const containerElement = containerElementRef.current;
    let rootNode = document.querySelector('#portal-root');

    if (!rootNode) {
      rootNode = document.createElement('div');
      rootNode.setAttribute('id', 'portal-root');
      document.body.appendChild(rootNode);
    }

    rootNode.appendChild(containerElement);

    return () => {
      rootNode?.removeChild(containerElement);
    };
  }, []);

  return createPortal(children, containerElementRef.current);
};
```

- [ ] **Step 2: Create `src/shared/components/icons.tsx`**

Re-exports all Ant Design icons from a single stable path. Modules can import `* as Icons from '@shared/components/icons'` instead of directly from `@ant-design/icons`.

```typescript
export * from '@ant-design/icons';
```

- [ ] **Step 3: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/shared/components/portal.tsx src/shared/components/icons.tsx
git commit -m "feat: add Portal component and icons barrel export"
```

---

### Task 15: Add `progress` module

**Files:**
- Create: `src/shared/modules/progress/styled/index.tsx`
- Create: `src/shared/modules/progress/components/index.tsx`

- [ ] **Step 1: Create `src/shared/modules/progress/styled/index.tsx`**

```typescript
import { Card, Typography } from 'antd';
import styled from 'styled-components';

const Wrapper = styled(Card).attrs({ size: 'small' })``;

const Text = styled.div<{ $last?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ $last }) => ($last ? 0 : '12px')};
`;

const Paragraph = styled(Typography.Paragraph)`
  margin-bottom: 0 !important;
`;

const Title = styled(Typography.Title)`
  margin-bottom: 0 !important;
  line-height: 30px !important;
`;

export const StyledProgress = { Wrapper, Text, Paragraph, Title };
```

- [ ] **Step 2: Create `src/shared/modules/progress/components/index.tsx`**

```typescript
import React, { FC, ReactNode } from 'react';
import { Progress } from 'antd';
import { StyledProgress } from '../styled';

interface ProgressUIProps {
  title: string;
  subTitle?: string;
  bottomText?: string;
  progress: number;
  value: ReactNode;
  bottomValue?: number;
}

export const ProgressUI: FC<ProgressUIProps> = ({ title, subTitle, value, progress, bottomText, bottomValue }) => {
  return (
    <StyledProgress.Wrapper>
      <StyledProgress.Text>
        <div>
          <StyledProgress.Paragraph strong={true}>{title}</StyledProgress.Paragraph>
          <StyledProgress.Paragraph>{subTitle}</StyledProgress.Paragraph>
        </div>
        <div>
          <StyledProgress.Title>{value}</StyledProgress.Title>
        </div>
      </StyledProgress.Text>
      <Progress showInfo={false} percent={progress} />
      <StyledProgress.Text $last={true}>
        <div>
          <StyledProgress.Paragraph>{bottomText}</StyledProgress.Paragraph>
        </div>
        <div>
          <StyledProgress.Paragraph>{bottomValue}</StyledProgress.Paragraph>
        </div>
      </StyledProgress.Text>
    </StyledProgress.Wrapper>
  );
};
```

- [ ] **Step 3: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/shared/modules/progress/styled/index.tsx src/shared/modules/progress/components/index.tsx
git commit -m "feat: add progress module (ProgressUI component)"
```

---

### Task 16: Add `rating` module

**Files:**
- Create: `src/shared/modules/rating/styled/index.tsx`
- Create: `src/shared/modules/rating/components/index.tsx`

- [ ] **Step 1: Create `src/shared/modules/rating/styled/index.tsx`**

```typescript
import React from 'react';
import styled from 'styled-components';
import { StarFilled } from '@ant-design/icons';

export const StyledRating = styled.div`
  display: flex;
`;

export const StyledRatingItem = styled.div.attrs({ children: <StarFilled /> })<{ $active?: boolean }>`
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#ffae38' : '#face98')};
  font-size: 24px;
  padding: 0 0.125rem;

  &:hover {
    color: #ffae38;
  }
`;
```

- [ ] **Step 2: Create `src/shared/modules/rating/components/index.tsx`**

```typescript
import React, { useCallback, useMemo, useState } from 'react';
import { StyledRating, StyledRatingItem } from '../styled';

interface RatingProps {
  value: string | number;
  onChange: (value: string) => void;
}

export const Rating: React.FC<RatingProps> = ({ value, onChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const parsedValue = useMemo(() => parseInt(String(value)), [value]);

  const handleChange = useCallback(
    (rating: number) => () => {
      onChange(rating === 1 ? '0' : rating.toString());
    },
    [onChange],
  );

  return (
    <StyledRating>
      {[1, 2, 3, 4, 5].map((rating) => (
        <StyledRatingItem
          key={rating}
          $active={parsedValue >= rating || hoveredRating >= rating}
          onClick={handleChange(rating)}
          onMouseEnter={() => setHoveredRating(rating)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      ))}
    </StyledRating>
  );
};
```

- [ ] **Step 3: Verify**

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/shared/modules/rating/styled/index.tsx src/shared/modules/rating/components/index.tsx
git commit -m "feat: add rating module (Rating component with star UI)"
```

---

## Completion Checklist

After all tasks are done, verify the full build:

```bash
yarn tsc --noEmit 2>&1 | head -40
```
Expected: no output.

```bash
git log --oneline -20
```
Expected: 16 commits from this plan visible.

### All files added/modified by this plan:

| File | Status |
|---|---|
| `src/shared/utils/caller.ts` | Modified |
| `src/shared/hooks/use-skip-effect.ts` | Created |
| `src/shared/hooks/use-search-params.ts` | Created |
| `src/shared/hooks/index.ts` | Modified |
| `src/shared/modules/next-table/context/provider.tsx` | Modified |
| `src/shared/utils/url-maker.ts` | Modified |
| `src/shared/utils/form-data-flat.ts` | Created |
| `src/shared/utils/sanitize-object.ts` | Created |
| `src/shared/utils/apply-to-form-data.ts` | Created |
| `src/shared/utils/get-base-64.ts` | Created |
| `src/shared/utils/input-formatters.ts` | Created |
| `src/shared/utils/two-level-shallow-equal-object.ts` | Created |
| `src/shared/utils/stop-propagation.ts` | Created |
| `src/shared/utils/index.ts` | Modified |
| `src/shared/helpers/index.ts` | Created |
| `src/shared/modules/form/fields/switch.tsx` | Created |
| `src/shared/modules/form/fields/multi-upload.tsx` | Created |
| `src/shared/modules/form/index.ts` | Modified |
| `src/shared/modules/antd/helpers/filter-option.ts` | Modified |
| `src/shared/modules/next-table/components/cells/check.tsx` | Created |
| `src/shared/modules/next-table/components/cells/price.tsx` | Created |
| `src/shared/styled/centered-container.tsx` | Created |
| `src/shared/styled/no.tsx` | Created |
| `src/shared/styled/space.tsx` | Created |
| `src/shared/styled/file-link.tsx` | Created |
| `src/shared/styled/tag-space.tsx` | Created |
| `src/shared/styled/utils.tsx` | Created |
| `src/shared/modules/antd/styled/descriptions.tsx` | Created |
| `src/shared/modules/antd/styled/page-header.tsx` | Created |
| `src/shared/modules/antd/styled/tabs.tsx` | Created |
| `src/shared/modules/antd/components/tooltip-label.tsx` | Created |
| `src/shared/components/portal.tsx` | Created |
| `src/shared/components/icons.tsx` | Created |
| `src/shared/modules/progress/styled/index.tsx` | Created |
| `src/shared/modules/progress/components/index.tsx` | Created |
| `src/shared/modules/rating/styled/index.tsx` | Created |
| `src/shared/modules/rating/components/index.tsx` | Created |
