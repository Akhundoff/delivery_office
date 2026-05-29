# Partner Box Acceptance — Design Spec

**Date:** 2026-05-25  
**Reference:** `delivery_management/src/@next/modules/partner-box-acceptance/`  
**Target:** `delivery_management_new/src/modules/partner-box-acceptance/`

---

## Context

The module is mostly built. Routing, services, interfaces, `BoxSelectionModal`, and the base hook/page are present. Five functional gaps remain between the new and old implementations.

---

## Gaps to Fix

### Gap 1 — `barcodeMap` state (hook)

Add `barcodeMap: Record<string, boolean>` state tracking which barcodes have `requires_declaration: true`. This map must be:
- Set when a scanned barcode returns `requiresDeclaration: true` (add entry)
- Cleared when `removeBarcode` removes a barcode (delete entry)
- Cleared on `resetBarcodes`
- Persisted to `localStorage` under key `partnerBoxAcceptance.barcodeMap` (same as old)
- Rehydrated from localStorage on mount (alongside `barcodes`)

### Gap 2 — `requires_declaration` in `tableData` (hook)

`tableData` rows must include `requires_declaration: !!barcodeMap[b.barcode]`. This field drives row highlighting in the page.

Also add `isRequiredDeclarationExist` as a `useMemo` over `tableData`: `tableData.some((r) => r.requires_declaration)`.

### Gap 3 — `onRow` row highlighting (page)

Add `onRow` callback to the `<Table>`:

```ts
const onRow = useCallback(
  (data) => ({
    style:
      closeError?.failedBarcodeIndexes?.includes(data.id - 1) ||
      duplicatedTrackCodes.includes(data.barcode) ||
      data.requires_declaration
        ? { backgroundColor: Colors.red[0] }
        : undefined,
  }),
  [closeError?.failedBarcodeIndexes, duplicatedTrackCodes],
);
```

Import `* as Colors from '@ant-design/colors'`.

### Gap 4 — Box-select trigger in `onClosePartnerBox` (hook)

Before calling the close mutation, check:

```ts
if (isRequiredDeclarationExist && !boxId) {
  setIsBoxSelectVisible(true);
  return;
}
```

Add `onOpenBoxSelect` to the hook's return value (already used internally, just needs to be exported).

### Gap 5 — `closePartnerBoxMutationError` with `failedBarcodeIndexes` (hook)

Replace the current string `closeError` with structured `closeError: { message: string; failedBarcodeIndexes: number[] } | null`.

Parse 422 error objects (keys like `track_code.0`, `track_code.2`) without the `flat` library:

```ts
const failedBarcodeIndexes = Object.keys(errors)
  .filter((k) => /^track_code\.\d+$/.test(k))
  .map((k) => parseInt(k.split('.')[1]));

const message = Object.entries(errors)
  .filter(([k]) => /^track_code\.\d+$/.test(k))
  .flatMap(([k, v]) => {
    const idx = parseInt(k.split('.')[1]);
    return (v as string[]).map((msg) =>
      msg.replace(`seçilmiş track_code.${idx}`, barcodes[idx]?.barcode || ''),
    );
  })
  .filter(Boolean)
  .join('. ');
```

The page passes `closeError` (structured) to `onRow` for per-row highlighting, and shows `closeError.message` in the `<Alert>`.

---

## Files Changed

| File | Change |
|---|---|
| `hooks/partnerBoxAcceptance/use-partner-box-acceptance.ts` | Add `barcodeMap`, `isRequiredDeclarationExist`, box-select trigger, structured `closeError`, fix `removeBarcode` |
| `pages/index.tsx` | Add `onRow`, import `Colors`, update `closeError` usage to structured type |

No new files. No service changes. No router changes. No sidebar changes.

---

## Out of Scope

- `playSound` on `requiresDeclaration` — no sound utility in new project
- `BarcodeScan` visual component — replaced with `Typography.Title` (acceptable)
- `branchId` from user — `IMeUser` has no `adminBranchId`; remains `undefined`
- The branch select in the "no box" state remains disabled (matching old behavior)
