# Shared Layer Completeness — Design Spec

**Date:** 2026-05-16  
**Project:** delivery_management_new  
**Reference architecture:** delivery_warehouse (`../delivery_warehouse/src/shared/`)  
**Scope:** Bring `src/shared/` to full parity with the warehouse shared layer, including all utilities, hooks, form fields, styled components, and sub-modules that will be required as the rewrite progresses.

---

## Context

`delivery_management_new` is a rewrite of `delivery_management` using `delivery_warehouse` architecture. The shared layer in the new project is minimal — it has the skeleton (caller, urlMaker, next-table, basic hooks) but is missing ~30 files that exist in the warehouse and will be needed as more modules are built. The user explicitly flagged the `NextTableProvider` not having skip-first-mount support, which the old project uses on the declarations page.

---

## Approach

Tier-based implementation: critical correctness fixes first, structural gaps second, enhancements third. Each tier is independently committable.

---

## Tier 1 — Critical Fixes

### 1. `utils/caller.ts` — fix hardcoded `lang`

**Change:** `lang: 'az'` → `lang: localStorage.getItem('i18nextLng') || 'az'`

The current hardcoded value breaks multi-language support. The warehouse reads from localStorage key `i18nextLng`, which is set by i18next.

### 2. `hooks/use-skip-effect.ts` — new hook

Skips the callback on first render, runs only on subsequent dependency changes.

```ts
export const useSkipEffect = (effect: EffectCallback, deps: DependencyList): void => {
  const isFirstRender = useRef<boolean>(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      return effect();
    }
  }, deps);
};
```

Export from `hooks/index.ts`.

### 3. `modules/next-table/context/provider.tsx` — add `skipFetch` prop

Port the pattern from `delivery_management`'s `TableProvider`:

- Add `skipFetch?: boolean` to the provider props interface.
- Store in `const skipFirstFetchRef = useRef(skipFetch ?? false)`.
- Inside the `useDebounceEffect` callback: if `skipFirstFetchRef.current` is true, set it to `false` and return early — skipping the fetch.
- When `skipFetch` is omitted or `false`, behaviour is identical to current.
- `handleFetch` remains exposed in context so action bars can trigger data load manually.

**Usage (future modules):**
```tsx
<NextTableProvider skipFetch name='declarations' context={DeclarationsContext} onFetch={handleFetch}>
  <DeclarationsActionBar /> {/* calls handleFetch from context */}
  <DeclarationsTable />
</NextTableProvider>
```

### 4. `hooks/use-search-params.ts` — new hook

Reads current URL search params as a typed object. Provides a stable `remove(name)` ref to strip a param and navigate. Depends on `useBackgroundNavigate` (already exists).

Export from `hooks/index.ts`.

---

## Tier 2 — Structural Gaps

### `utils/url-maker.ts` — extend

Add two exports alongside existing `urlMaker`:

- `localURLMaker(pathname, pathParams?, query?)` — fills `:param` placeholders, appends query string. For client-side route construction.
- `staticFileUrl(fileName)` — shorthand: `urlMaker(localURLMaker('/storage/files/:fileName', { fileName }))`.

### New utils (all exported from `utils/index.ts`)

| File | Purpose |
|---|---|
| `utils/form-data-flat.ts` | Flatten nested objects to bracket notation (`a[b]=v`). Used by `object2Search` for nested params. |
| `utils/sanitize-object.ts` | Remove keys whose values are in a given set (e.g. `undefined`, `null`, `''`). Used before API calls. |
| `utils/apply-to-form-data.ts` | Iterate an object and append each entry to a `FormData` instance. Used for file upload requests. |
| `utils/get-base-64.ts` | Wrap `FileReader` in a Promise, resolve base64 string. Used for image previews before upload. |
| `utils/input-formatters.ts` | `InputFormatters` class with static `decimal(e)` and `integer(e)` for `onKeyPress` handlers. |
| `utils/two-level-shallow-equal-object.ts` | Equality check two levels deep. Used as memoization guard. |
| `utils/stop-propagation.ts` | Wraps an event handler to call `e.stopPropagation()` before the handler. |

### `helpers/index.ts` — new directory

```ts
export const baseErrorParser = (errors: Record<string, string[]>): string[] => {
  return Object.values(errors).flat();
};
```

Flattens API validation error maps (field → messages[]) into a flat string array for display.

### Form fields

- `modules/form/fields/switch.tsx` — controlled Ant Design `Switch` wrapped for form use (value/onChange props).
- `modules/form/fields/multi-upload.tsx` — multiple file selection with file list display.

Both re-exported from `modules/form/index.ts`.

### Antd helpers — two new strategies

Added to `modules/antd/helpers/filter-option.ts`:

- `filterOptionWithNameOrId(input, option)` — search by name or numeric ID in a Select. Useful for selects that display `#ID — Name` format.
- `filterOptionStart(input, option)` — matches only from the start of the option label string.

### Next-table cells

New directory `modules/next-table/components/cells/`:

- `check.tsx` — read-only checkbox cell (`NextTableCheckCell`).
- `price.tsx` — formats a number as currency with configurable code (`NextTablePriceCell`, supports AZN/USD/TRY).

Exported from `modules/next-table/` so column definitions import them without reaching into shared/components.

---

## Tier 3 — Enhancements

### Styled components (`shared/styled/`)

Ported from warehouse (with new project's theme colors where applicable):

| File | Purpose |
|---|---|
| `centered-container.tsx` | Flex centering wrapper |
| `no.tsx` | Styled "no data" / disabled text |
| `space.tsx` | Horizontal or vertical spacer |
| `file-link.tsx` | Styled anchor tag for file downloads |
| `tag-space.tsx` | Wraps tags with consistent gap |
| `utils.tsx` | Misc small helpers: truncated text, etc. |

### Antd styled (`modules/antd/styled/`)

New directory with three files ported from warehouse:

- `descriptions.tsx` — compact `Descriptions` override
- `page-header.tsx` — styled page header
- `tabs.tsx` — styled tabs

### Antd component

- `modules/antd/components/tooltip-label.tsx` — a label with an inline info tooltip icon. Used in forms for fields that need explanation text.

### Shared components

- `components/portal.tsx` — `createPortal` wrapper, renders children into `document.body`. For overlays outside the component tree.
- `components/icons.tsx` — re-exports Ant Design icons used across the project from one stable path.

### Sub-modules

- `modules/progress/` — styled progress bar over Ant Design `Progress` (`components/index.tsx` + `styled/index.tsx`).
- `modules/rating/` — styled star rating over Ant Design `Rate` (`components/index.tsx` + `styled/index.tsx`).

---

## File Change Summary

| File | Action |
|---|---|
| `utils/caller.ts` | Edit — fix `lang` |
| `hooks/use-skip-effect.ts` | New |
| `hooks/use-search-params.ts` | New |
| `hooks/index.ts` | Edit — add exports |
| `modules/next-table/context/provider.tsx` | Edit — add `skipFetch` |
| `utils/url-maker.ts` | Edit — add `localURLMaker`, `staticFileUrl` |
| `utils/form-data-flat.ts` | New |
| `utils/sanitize-object.ts` | New |
| `utils/apply-to-form-data.ts` | New |
| `utils/get-base-64.ts` | New |
| `utils/input-formatters.ts` | New |
| `utils/two-level-shallow-equal-object.ts` | New |
| `utils/stop-propagation.ts` | New |
| `utils/index.ts` | Edit — add exports |
| `helpers/index.ts` | New dir + file |
| `modules/form/fields/switch.tsx` | New |
| `modules/form/fields/multi-upload.tsx` | New |
| `modules/form/index.ts` | Edit — add exports |
| `modules/antd/helpers/filter-option.ts` | Edit — add 2 strategies |
| `modules/next-table/components/cells/check.tsx` | New |
| `modules/next-table/components/cells/price.tsx` | New |
| `styled/centered-container.tsx` | New |
| `styled/no.tsx` | New |
| `styled/space.tsx` | New |
| `styled/file-link.tsx` | New |
| `styled/tag-space.tsx` | New |
| `styled/utils.tsx` | New |
| `modules/antd/styled/descriptions.tsx` | New |
| `modules/antd/styled/page-header.tsx` | New |
| `modules/antd/styled/tabs.tsx` | New |
| `modules/antd/components/tooltip-label.tsx` | New |
| `components/portal.tsx` | New |
| `components/icons.tsx` | New |
| `modules/progress/components/index.tsx` | New |
| `modules/progress/styled/index.tsx` | New |
| `modules/rating/components/index.tsx` | New |
| `modules/rating/styled/index.tsx` | New |

---

## Constraints

- All code uses `dayjs`, not `moment`.
- Theme colors come from `src/shared/theme/index.ts` (new project palette), not hardcoded from warehouse.
- No `event-bus` module — excluded by user decision.
- Object-to-search stays as `URLSearchParams`-based (new project's version) — `form-data-flat` is added as a standalone utility but `object2Search` is not changed to use it.
- All new files follow: `singleQuote: true`, `trailingComma: all`, `printWidth: 200`.
