# BarcodeScan Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the `BarcodeScan` visual animation component from the old project into the new `partner-box-acceptance` module and wire it into the page.

**Architecture:** One new file — a `styled-components` component with two CSS keyframe animations. The page swaps its current `Typography.Title` display of the last barcode for this component. No new dependencies needed.

**Tech Stack:** React 18, TypeScript, `styled-components` ^6

---

## File Map

| File | Change |
|---|---|
| `src/modules/partner-box-acceptance/components/barcode-scan.tsx` | Create — the visual component |
| `src/modules/partner-box-acceptance/pages/index.tsx` | Modify — swap Typography.Title for BarcodeScan |

---

### Task 1: Create the BarcodeScan component

**Files:**
- Create: `src/modules/partner-box-acceptance/components/barcode-scan.tsx`

- [ ] **Step 1: Create the file with the full component**

```tsx
import { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const beam = keyframes`
  50% { opacity: 0.7; }
`;

const scanningAnimation = keyframes`
  0%   { transform: translateY(10px); }
  50%  { transform: translateY(-60px); }
  100% { transform: translateY(10px); }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Inner = styled.div`
  position: relative;
  width: 200px;
`;

const Lines = styled.div`
  display: flex;
  justify-content: space-between;
  height: 80px;
`;

const Bar = styled.div<{ $w: number }>`
  width: ${({ $w }) => $w}px;
  background-color: #000;
`;

const Values = styled.div`
  text-align: center;
  margin-top: -4px;
`;

const Scanner = styled.div`
  animation: ${scanningAnimation} 2s infinite;
`;

const Laser = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  height: 1px;
  width: calc(100% + 50px);
  background-color: red;
  transform: translateX(-50%);
  box-shadow: 0 0 4px red;
  animation: ${beam} 0.1s infinite;
`;

const BAR_WIDTHS = [2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 4, 2, 1, 3, 5, 2, 4, 1, 3, 2, 4];

export const BarcodeScan: FC<{ barcode?: string }> = ({ barcode = 'xxxx xxxx xxxx' }) => (
  <Container>
    <Inner>
      <Lines>
        {BAR_WIDTHS.map((w, i) => (
          <Bar key={i} $w={w} />
        ))}
      </Lines>
      <Values>{barcode}</Values>
      <Scanner>
        <Laser />
      </Scanner>
    </Inner>
  </Container>
);
```

- [ ] **Step 2: Run TypeScript check on the new file**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | grep "barcode-scan" | head -10
```

Expected: no output (zero errors).

---

### Task 2: Wire BarcodeScan into the page

**Files:**
- Modify: `src/modules/partner-box-acceptance/pages/index.tsx`

- [ ] **Step 1: Add the BarcodeScan import**

At the top of `pages/index.tsx`, after the existing component imports, add:

```tsx
import { BarcodeScan } from '../components/barcode-scan';
```

- [ ] **Step 2: Replace the Typography.Title block with BarcodeScan**

Find this block inside the scanning state's left column:

```tsx
              {lastBarcode && (
                <Typography.Title level={4} style={{ fontFamily: 'monospace', letterSpacing: 2 }}>{lastBarcode.barcode}</Typography.Title>
              )}
```

Replace it with:

```tsx
              <BarcodeScan barcode={lastBarcode?.barcode} />
```

- [ ] **Step 3: Remove Typography from the antd import if now unused**

Check whether `Typography` is used anywhere else in the file. If `Typography` no longer appears after the replacement, remove it from the antd import line:

```tsx
import { Alert, Button, Col, Input, Row, Select, Space, Switch, Table, Spin, Result } from 'antd';
```

- [ ] **Step 4: Run TypeScript check**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | grep "src/" | head -10
```

Expected: no output (zero errors in src/).

- [ ] **Step 5: Commit**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && git add src/modules/partner-box-acceptance/components/barcode-scan.tsx src/modules/partner-box-acceptance/pages/index.tsx && git commit -m "feat(partner-box-acceptance): add BarcodeScan animation component"
```
