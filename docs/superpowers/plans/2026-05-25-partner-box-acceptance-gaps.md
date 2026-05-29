# Partner Box Acceptance — Gap Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix five functional gaps in `partner-box-acceptance` so its hook and page match the behaviour of the old `delivery_management` reference implementation.

**Architecture:** Two files change — the hook adds `barcodeMap` state, `isRequiredDeclarationExist`, structured error parsing, and the box-select trigger; the page adds `onRow` row-highlighting. No new files, no service changes, no router changes.

**Tech Stack:** React 18, TypeScript, Ant Design 5, react-query v3, `@ant-design/colors`

---

## File Map

| File | Change |
|---|---|
| `src/modules/partner-box-acceptance/hooks/partnerBoxAcceptance/use-partner-box-acceptance.ts` | Add `barcodeMap`, `isRequiredDeclarationExist`, structured `closeError`, box-select trigger, fix `removeBarcode` + localStorage |
| `src/modules/partner-box-acceptance/pages/index.tsx` | Add `onRow`, import `Colors`, fix `closeError` prop usage |

---

### Task 1: Add `barcodeMap` state and wire it into `barcodeMap` → `tableData` → `isRequiredDeclarationExist`

**Files:**
- Modify: `src/modules/partner-box-acceptance/hooks/partnerBoxAcceptance/use-partner-box-acceptance.ts`

- [ ] **Step 1: Open the hook and locate the state declarations block (around line 28–35)**

The block currently looks like:

```ts
const barcodeInputRef = useRef<any>(null);
const [disabled, setDisabled] = useState(false);
const [barcodeType, setBarcodeType] = useState(false);
const [barcodes, setBarcodes] = useState<IAcceptanceBarcode[]>([]);
const [duplicatedTrackCodes, setDuplicatedTrackCodes] = useState<string[]>([]);
const [boxId, setBoxId] = useState('');
const [isBoxSelectVisible, setIsBoxSelectVisible] = useState(false);
const [closeError, setCloseError] = useState<string | null>(null);
```

Replace the entire block with:

```ts
const barcodeInputRef = useRef<any>(null);
const [disabled, setDisabled] = useState(false);
const [barcodeType, setBarcodeType] = useState(false);
const [barcodes, setBarcodes] = useState<IAcceptanceBarcode[]>([]);
const [barcodeMap, setBarcodeMap] = useState<Record<string, boolean>>({});
const [duplicatedTrackCodes, setDuplicatedTrackCodes] = useState<string[]>([]);
const [boxId, setBoxId] = useState('');
const [isBoxSelectVisible, setIsBoxSelectVisible] = useState(false);
const [closeError, setCloseError] = useState<{ message: string; failedBarcodeIndexes: number[] } | null>(null);
```

- [ ] **Step 2: Update `tableData` to include `requires_declaration`**

Find the current `tableData` useMemo:

```ts
const tableData = useMemo(
  () => barcodes.map((b, i) => ({ id: i + 1, barcode: b.barcode, branch_name: b.branch_name, flight_name: b.flight_name })),
  [barcodes],
);
```

Replace it with:

```ts
const tableData = useMemo(
  () =>
    barcodes.map((b, i) => ({
      id: i + 1,
      barcode: b.barcode,
      branch_name: b.branch_name,
      flight_name: b.flight_name,
      requires_declaration: !!barcodeMap[b.barcode],
    })),
  [barcodes, barcodeMap],
);

const isRequiredDeclarationExist = useMemo(() => tableData.some((r) => r.requires_declaration), [tableData]);
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | grep "partner-box-acceptance" | head -20
```

Expected: no errors from this file at this point.

---

### Task 2: Fix `resetBarcodes` and `removeBarcode` to also clear `barcodeMap`

**Files:**
- Modify: `src/modules/partner-box-acceptance/hooks/partnerBoxAcceptance/use-partner-box-acceptance.ts`

- [ ] **Step 1: Replace `resetBarcodes`**

Find:

```ts
const resetBarcodes = useCallback(() => {
  setBarcodes([]);
  setDuplicatedTrackCodes([]);
  setCloseError(null);
}, []);
```

Replace with:

```ts
const resetBarcodes = useCallback(() => {
  setBarcodes([]);
  setBarcodeMap({});
  setDuplicatedTrackCodes([]);
  setCloseError(null);
}, []);
```

- [ ] **Step 2: Replace `removeBarcode`**

Find:

```ts
const removeBarcode = useCallback((index: number) => {
  setBarcodes((prev) => prev.filter((_, i) => i !== index));
  setDuplicatedTrackCodes((prev) => {
    const barcode = barcodes[index];
    return barcode ? prev.filter((tc) => tc !== barcode.barcode) : prev;
  });
}, [barcodes]);
```

Replace with:

```ts
const removeBarcode = useCallback(
  (index: number) => {
    const barcode = barcodes[index];
    setBarcodes((prev) => prev.filter((_, i) => i !== index));
    if (barcode) {
      setDuplicatedTrackCodes((prev) => prev.filter((tc) => tc !== barcode.barcode));
      setBarcodeMap((prev) => {
        const next = { ...prev };
        delete next[barcode.barcode];
        return next;
      });
    }
  },
  [barcodes],
);
```

---

### Task 3: Set `barcodeMap` entry when a `requiresDeclaration` barcode is scanned

**Files:**
- Modify: `src/modules/partner-box-acceptance/hooks/partnerBoxAcceptance/use-partner-box-acceptance.ts`

- [ ] **Step 1: Locate the `requiresDeclaration` branch in `onBarcodeSearch`**

Find this block inside `onBarcodeSearch`:

```ts
if (decl.requiresDeclaration) {
  setBarcodes((prev) => [barcode, ...prev]);
  Modal.confirm({
    title: 'Diqqət Bəyansız Bağlama!',
    content: 'Bəyansız bağlama bu yeşiyə əlavə edilə bilməz.',
    okButtonProps: { hidden: true },
    okCancel: false,
  });
  setTimeout(() => {
    Modal.destroyAll();
    barcodeInputRef.current?.setValue?.('');
    barcodeInputRef.current?.focus?.();
  }, 1000);
  return;
}
```

Replace with:

```ts
if (decl.requiresDeclaration) {
  setBarcodes((prev) => [barcode, ...prev]);
  setBarcodeMap((prev) => ({ ...prev, [barcode.barcode]: true }));
  Modal.confirm({
    title: 'Diqqət Bəyansız Bağlama!',
    content: 'Bəyansız bağlama bu yeşiyə əlavə edilə bilməz.',
    okButtonProps: { hidden: true },
    okCancel: false,
  });
  setTimeout(() => {
    Modal.destroyAll();
    barcodeInputRef.current?.setValue?.('');
    barcodeInputRef.current?.focus?.();
  }, 1000);
  return;
}
```

---

### Task 4: Add box-select trigger to `onClosePartnerBox`

**Files:**
- Modify: `src/modules/partner-box-acceptance/hooks/partnerBoxAcceptance/use-partner-box-acceptance.ts`

- [ ] **Step 1: Locate `onClosePartnerBox`**

Find:

```ts
const onClosePartnerBox = useCallback(() => {
  const mutation = () => {
    closeBoxMutation.mutate({ trackCodes: barcodes.map((b) => b.barcode), containerId: boxId });
  };

  if (duplicatedTrackCodes.length) {
```

Replace the entire `onClosePartnerBox` with:

```ts
const onOpenBoxSelect = useCallback(() => setIsBoxSelectVisible(true), []);

const onClosePartnerBox = useCallback(() => {
  if (isRequiredDeclarationExist && !boxId) {
    onOpenBoxSelect();
    return;
  }

  const mutation = () => {
    closeBoxMutation.mutate({ trackCodes: barcodes.map((b) => b.barcode), containerId: boxId });
  };

  if (duplicatedTrackCodes.length) {
    Modal.confirm({
      title: 'Diqqət',
      content: `${duplicatedTrackCodes.length} ədəd təkrar izləmə kodu aşkarlandır. Əməliyyatı davam etməyə əminsinizmi?`,
      onOk: mutation,
    });
  } else {
    mutation();
  }
}, [barcodes, boxId, closeBoxMutation, duplicatedTrackCodes.length, isRequiredDeclarationExist, onOpenBoxSelect]);
```

- [ ] **Step 2: Add `onOpenBoxSelect` to the hook's return value**

Find the return statement. It currently has `onCloseBoxSelect` but not `onOpenBoxSelect`. Add `onOpenBoxSelect` to the return object:

```ts
return {
  partnerBoxes,
  myPartnerBox,
  selectBoxMutation,
  closeBoxMutation,
  closeError,
  resetBarcodes,
  onClosePartnerBox,
  onSelectPartnerBox,
  onBarcodeSearch,
  tableData,
  barcodes,
  disabled,
  removeBarcode,
  duplicatedTrackCodes,
  canClearBarcodes: barcodes.length > 0,
  barcodeType,
  onBarcodeTypeSwitch,
  barcodeInputRef,
  isBoxSelectVisible,
  onSelectBoxId,
  onOpenBoxSelect,
  onCloseBoxSelect,
  lastBarcode: barcodes[0],
};
```

---

### Task 5: Implement structured `closeError` with `failedBarcodeIndexes` from 422 errors

**Files:**
- Modify: `src/modules/partner-box-acceptance/hooks/partnerBoxAcceptance/use-partner-box-acceptance.ts`

- [ ] **Step 1: Replace `closeBoxMutation` with structured error handling**

Find the entire `closeBoxMutation` useMutation block:

```ts
const closeBoxMutation = useMutation(
  async ({ trackCodes, containerId }: { trackCodes: string[]; containerId: string }) => {
    const result = await PartnerBoxAcceptanceService.closeBox(trackCodes, containerId);
    if (result.status === 200) return;
    if (result.status === 422) throw new Error(Object.values(result.data as Record<string, string[]>).flat().join('. '));
    throw new Error(result.data as string);
  },
  {
    onSuccess: () => {
      setBarcodes([]);
      setDuplicatedTrackCodes([]);
      setBoxId('');
      setCloseError(null);
      queryClient.invalidateQueries(['my-partner-box']);
      message.success('Əməliyyat müvəffəqiyyətlə başa çatdı.');
    },
    onError: (err: Error) => {
      setCloseError(err.message);
      message.error(err.message);
    },
  },
);
```

Replace with:

```ts
const closeBoxMutation = useMutation(
  async ({ trackCodes, containerId }: { trackCodes: string[]; containerId: string }) => {
    const result = await PartnerBoxAcceptanceService.closeBox(trackCodes, containerId);
    if (result.status === 200) return { errors: null };
    if (result.status === 422) return { errors: result.data as Record<string, string[]> };
    throw new Error(result.data as string);
  },
  {
    onSuccess: (data) => {
      if (data?.errors) {
        const errors = data.errors;
        const failedBarcodeIndexes = Object.keys(errors)
          .filter((k) => /^track_code\.\d+$/.test(k))
          .map((k) => parseInt(k.split('.')[1]));

        const msg = Object.entries(errors)
          .filter(([k]) => /^track_code\.\d+$/.test(k))
          .flatMap(([k, v]) => {
            const idx = parseInt(k.split('.')[1]);
            return (v as string[]).map((m) => m.replace(`seçilmiş track_code.${idx}`, barcodes[idx]?.barcode || ''));
          })
          .filter(Boolean)
          .join('. ');

        const fallbackMsg = Object.values(errors).flat().join('. ');
        setCloseError({ message: msg || fallbackMsg, failedBarcodeIndexes });
        message.error(msg || fallbackMsg);
        return;
      }

      setBarcodes([]);
      setBarcodeMap({});
      setDuplicatedTrackCodes([]);
      setBoxId('');
      setCloseError(null);
      queryClient.invalidateQueries(['my-partner-box']);
      message.success('Əməliyyat müvəffəqiyyətlə başa çatdı.');
    },
    onError: (err: Error) => {
      setCloseError({ message: err.message, failedBarcodeIndexes: [] });
      message.error(err.message);
    },
  },
);
```

---

### Task 6: Persist and rehydrate `barcodeMap` in localStorage

**Files:**
- Modify: `src/modules/partner-box-acceptance/hooks/partnerBoxAcceptance/use-partner-box-acceptance.ts`

- [ ] **Step 1: Update the rehydration `useEffect`**

Find:

```ts
useEffect(() => {
  const saved = localStorage.getItem('partnerBoxAcceptance.barcodes');
  if (saved) setBarcodes(JSON.parse(saved));
}, []);
```

Replace with:

```ts
useEffect(() => {
  const savedBarcodes = localStorage.getItem('partnerBoxAcceptance.barcodes');
  const savedMap = localStorage.getItem('partnerBoxAcceptance.barcodeMap');
  if (savedBarcodes) setBarcodes(JSON.parse(savedBarcodes));
  if (savedMap) setBarcodeMap(JSON.parse(savedMap));
}, []);
```

- [ ] **Step 2: Update the persistence `useEffect`**

Find:

```ts
useEffect(() => {
  localStorage.setItem('partnerBoxAcceptance.barcodes', JSON.stringify(barcodes));
}, [barcodes]);
```

Replace with:

```ts
useEffect(() => {
  localStorage.setItem('partnerBoxAcceptance.barcodes', JSON.stringify(barcodes));
  localStorage.setItem('partnerBoxAcceptance.barcodeMap', JSON.stringify(barcodeMap));
}, [barcodes, barcodeMap]);
```

---

### Task 7: Add `onRow` row-highlighting to the page

**Files:**
- Modify: `src/modules/partner-box-acceptance/pages/index.tsx`

- [ ] **Step 1: Add `@ant-design/colors` import and update the hook destructure**

Find the current imports at the top of `pages/index.tsx`:

```ts
import { FC, useCallback } from 'react';
import { Alert, Button, Col, Input, Row, Select, Space, Switch, Table, Typography, Spin, Result } from 'antd';
import * as Icons from '@ant-design/icons';
import { PageContent } from '@shared/styled/page-content';
import { usePartnerBoxAcceptance } from '../hooks';
import { BoxSelectionModal } from '../components/box-selection-modal';
```

Replace with:

```ts
import { FC, useCallback } from 'react';
import { Alert, Button, Col, Input, Row, Select, Space, Switch, Table, Typography, Spin, Result } from 'antd';
import * as Icons from '@ant-design/icons';
import * as Colors from '@ant-design/colors';
import { PageContent } from '@shared/styled/page-content';
import { usePartnerBoxAcceptance } from '../hooks';
import { BoxSelectionModal } from '../components/box-selection-modal';
```

- [ ] **Step 2: Update the hook destructure to include `closeError` (structured)**

Find the destructure block at the top of `PartnerBoxAcceptancePage`. It currently has `closeError`. No rename needed — but make sure `closeError` is destructured (it already is).

- [ ] **Step 3: Add `onRow` callback after the existing `title` callback**

Find the `title` useCallback block and add `onRow` right after it:

```ts
const onRow = useCallback(
  (data: any) => ({
    style:
      closeError?.failedBarcodeIndexes?.includes(data.id - 1) || duplicatedTrackCodes.includes(data.barcode) || data.requires_declaration
        ? { backgroundColor: Colors.red[0] }
        : undefined,
  }),
  [closeError, duplicatedTrackCodes],
);
```

- [ ] **Step 4: Wire `onRow` and fix the Alert message into the `<Table>`**

Find the `<Table>` inside the `myPartnerBox.data` branch:

```tsx
<Table title={title} rowKey='id' dataSource={tableData} size='small' bordered={true}>
```

Replace with:

```tsx
<Table onRow={onRow} title={title} rowKey='id' dataSource={tableData} size='small' bordered={true}>
```

- [ ] **Step 5: Fix the `closeError` Alert to use `.message`**

Find:

```tsx
{closeError && <Alert type='error' showIcon={true} message={closeError} style={{ marginBottom: 16 }} />}
```

Replace with:

```tsx
{closeError && <Alert type='error' showIcon={true} message={closeError.message} style={{ marginBottom: 16 }} />}
```

---

### Task 8: TypeScript check and manual smoke-test

**Files:** none created/modified

- [ ] **Step 1: Run TypeScript check across the two changed files**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | grep -E "partner-box-acceptance|error TS" | head -30
```

Expected: zero errors mentioning `partner-box-acceptance`.

- [ ] **Step 2: Start dev server**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npm start
```

- [ ] **Step 3: Navigate to `/partner/acceptance/box` and verify the "no box selected" state**

- Page renders a `<Result>` with a box Select
- Selecting a box from the list calls `selectBox` and transitions to the scanning state

- [ ] **Step 4: Verify the scanning state**

- Page title shows `#<id> - <name>`
- Scanning a valid barcode adds a row to the table
- Scanning a `requiresDeclaration` barcode adds it red-highlighted and shows the 1-second modal
- Clicking "Yeşiyi bağla" with a `requiresDeclaration` row and no `boxId` opens the `BoxSelectionModal`

- [ ] **Step 5: Commit**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && git add src/modules/partner-box-acceptance/hooks/partnerBoxAcceptance/use-partner-box-acceptance.ts src/modules/partner-box-acceptance/pages/index.tsx && git commit -m "fix(partner-box-acceptance): add barcodeMap, row highlighting, box-select trigger, and structured 422 errors"
```
