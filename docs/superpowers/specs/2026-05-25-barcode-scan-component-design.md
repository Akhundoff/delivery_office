# BarcodeScan Component — Design Spec

**Date:** 2026-05-25  
**Reference:** `delivery_management/src/components/Common/BarcodeScan.tsx` + `src/scss/barcode-scan.scss`  
**Target:** `delivery_management_new/src/modules/partner-box-acceptance/components/barcode-scan.tsx`

---

## Component

A purely visual barcode scanner animation. No logic, no state, one prop.

```
Props: { barcode?: string }   // defaults to 'xxxx xxxx xxxx'
```

**Structure:**
- Outer centering container
- 24 vertical black bars of varying widths (2–5px) arranged in a flex row — simulates a barcode
- Text line below bars showing the `barcode` value
- Animated red laser line that travels up and down over the bars (2s loop)

The original SCSS uses `random(5)` to generate bar widths at build time. The new component hard-codes a realistic-looking 24-width pattern. The laser animation uses two keyframes: `beam` (opacity flicker at 0.1s) and `scanningAnimation` (translateY between 10px and -60px at 2s).

---

## Implementation

**Styling:** `styled-components` (already in project). All keyframes defined inline via `css` helper and `keyframes` from `styled-components`.

**Placement:** Local to the `partner-box-acceptance` module — `components/barcode-scan.tsx`. Not promoted to `shared/components` since it is only used in this module.

---

## Page Integration

In `pages/index.tsx`, replace the current `Typography.Title` block:

```tsx
{lastBarcode && (
  <Typography.Title level={4} style={{ fontFamily: 'monospace', letterSpacing: 2 }}>{lastBarcode.barcode}</Typography.Title>
)}
```

With:

```tsx
<BarcodeScan barcode={lastBarcode?.barcode} />
```

Remove the `Typography` import from antd if it becomes unused after the swap.

---

## Files

| File | Change |
|---|---|
| `src/modules/partner-box-acceptance/components/barcode-scan.tsx` | Create |
| `src/modules/partner-box-acceptance/pages/index.tsx` | Swap Typography.Title → BarcodeScan |
