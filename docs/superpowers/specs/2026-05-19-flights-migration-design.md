# Flights Module Migration Design

**Date:** 2026-05-19
**Source:** `delivery_management/src/@next/modules/flights/`
**Destination:** `delivery_management_new/src/modules/flights/`
**Approach:** Full Pattern Match — mirrors the `declarations`/`boxes`/`branches` module pattern exactly.

---

## Context

`delivery_management_new` is missing 22 modules present in `delivery_management/@next/`. The `flights` module is the first to be migrated and serves as the template for all subsequent migrations. Every architectural decision here must be reusable across the remaining 21 modules.

The two projects use different architectures:

| Concern | `@next/` (source) | `delivery_management_new` (target) |
|---|---|---|
| HTTP | Inversify `HttpClient` + repos | `caller()` + `ApiResult` |
| State | Inversify + custom contexts + EventBus | `createNextTableContext()` + use-cases |
| DI | `@bind` / `useService` | None |
| Forms | Formik + `@core/form` fields | Formik + `@shared/modules/form` fields |
| Routing | React Router v5 `<Switch>` | React Router v6 `<Routes>` |
| Create/Update UI | Route-based modals | Route-based modals (`<Modal open={true}>`) |

---

## File Structure

```
src/modules/flights/
├── services/
│   └── index.ts                  ← FlightsService — all API calls
├── context/
│   └── index.ts                  ← FlightsTableContext = createNextTableContext<IFlight>()
├── use-cases/
│   └── table-fetch.ts            ← flightsTableFetchUseCase
├── interfaces/
│   ├── flight.interface.ts       ← IFlight, IFlightPersistence, IFlightById, IFlightByIdPersistence
│   └── index.ts
├── mappers/
│   └── index.ts                  ← FlightMapper.toDomain(), FlightMapper.toDetailDomain()
├── hooks/
│   ├── use-flights-table.ts      ← columns + refetch signal watcher
│   ├── use-flights-table-columns.ts ← column definitions
│   ├── use-flight-form.ts        ← create/update form logic
│   └── index.ts
├── containers/
│   ├── flights-table.tsx         ← table container
│   ├── flights-action-bar.tsx    ← filters + create button
│   ├── create-flight.tsx         ← route-based modal form
│   └── index.ts
├── pages/
│   ├── flights.tsx               ← NextTableProvider + containers
│   └── index.ts
├── router/
│   ├── page.router.tsx           ← registered inside HomeRouter
│   └── modal.router.tsx          ← registered at app-level modal layer
└── index.ts                      ← barrel export
```

---

## Services Layer

`FlightsService` — static class, all methods return `ApiResult<Status, Data>`.

```typescript
class FlightsService {
  static getFlights(query): Promise<ApiResult<200, { data: IFlight[]; total: number }> | ApiResult<400 | 500, string>>
  // GET /api/admin/v2/flights/list

  static getFlightById(id): Promise<ApiResult<200, IFlightById> | ApiResult<400 | 500, string>>
  // GET /api/admin/flights/detail?flight_id={id}

  static createFlight(values): Promise<ApiResult<200, null> | ApiResult<422, Record<string, string>> | ApiResult<400 | 500, string>>
  // POST /api/admin/flights/create

  static updateFlight(id, values): Promise<ApiResult<200, null> | ApiResult<422, Record<string, string>> | ApiResult<400 | 500, string>>
  // POST (update via create endpoint with id if applicable, or dedicated endpoint)

  static closeFlight(values): Promise<ApiResult<200, null> | ApiResult<422, Record<string, string>> | ApiResult<400 | 500, string>>
  // POST /api/admin/flights/close

  static updateAirWaybill(values): Promise<ApiResult<200, null> | ApiResult<422, Record<string, string>> | ApiResult<400 | 500, string>>
  // POST /api/admin/flights/airwaybill
}
```

**Error handling convention (same as all existing services):**
- `response.ok` → map with `FlightMapper.toDomain()` → `ApiResult<200, ...>`
- `response.status === 422` + body has `errors` → `ApiResult<422, mappedErrors>`
- any other non-ok → `ApiResult<400, 'Əməliyyat aparıla bilmədi.'>`
- `catch` → `ApiResult<500, 'Şəbəkə ilə əlaqə qurula bilmədi.'>`

All error messages in Azerbaijani.

---

## Context + Use-Cases

```typescript
// context/index.ts
export const FlightsTableContext = createNextTableContext<IFlight>();
```

```typescript
// use-cases/table-fetch.ts
export const flightsTableFetchUseCase = (params) => async (dispatch) => {
  dispatch(nextTableFetchDataStartedAction());
  const result = await FlightsService.getFlights(params);
  if (result.status === 200) {
    dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
  } else {
    dispatch(nextTableFetchDataFailedAction());
    message.error(result.data as string);
  }
};
```

---

## Hooks

### `useFlightsTableColumns`
Returns `Column<IFlight>[]` for react-table. Includes an actions column with edit (navigates to `/flights/:id/update` via `useBackgroundNavigate` with `{ withBackground: true }`) and delete (calls `FlightsService.closeFlight`, confirms via `Modal.confirm`, triggers `handleFetch` on success).

### `useFlightsTable`
- Reads `FlightsTableContext`
- Gets columns from `useFlightsTableColumns`
- Watches `searchParams.reFetchFlightsTable` via `useEffect` — removes param and calls `handleFetch()` when present
- Returns `{ columns }`

### `useFlightForm`
- `useParams<{ id?: string }>()` — present for update, absent for create
- `useQuery(['flights', id], ...)` enabled only when `id` is set — loads existing flight data
- `initialValues` built from detail query data or empty defaults; `enableReinitialize: true`
- `onSubmit`: calls `createFlight` or `updateFlight` based on `id`
  - 200 → `message.success(...)` → `navigate(localURLMaker('/flights', {}, { reFetchFlightsTable: '1' }))`
  - 422 → `helpers.setErrors(mappedErrors)`
  - 400/500 → `message.error(...)`
- Returns `{ initialValues, onSubmit, id, isLoading }`

---

## Containers

### `FlightsTable`
Reads from `useFlightsTable()`. Renders `<NextTable columns={columns} />`.

### `FlightsActionBar`
- Renders filters (search by name, date range, country, status)
- "Yeni uçuş" button: `navigate('/flights/create', { withBackground: true })`

### `CreateFlight`
Route-based modal — always rendered with `<Modal open={true}>`.

```typescript
export const CreateFlight: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useFlightForm();
  const [closeModal] = useCloseModal();

  if (isLoading) return <Modal open footer={null} closable={false}><Spin /></Modal>;

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
      {({ handleSubmit, isSubmitting }) => (
        <Modal
          open
          onOk={() => handleSubmit()}
          onCancel={() => closeModal('/flights')}
          confirmLoading={isSubmitting}
          title={id ? 'Uçuşu düzəlt' : 'Yeni uçuş'}
          okText='Yadda saxla'
          cancelText='Ləğv et'
        >
          <Form layout='vertical' component='div' size='large'>
            <TextField name='name' item={{ label: 'Ad' }} />
            {/* DatePickerField for startedAt, endedAt */}
            {/* SelectField for countryId, statusId */}
          </Form>
        </Modal>
      )}
    </Formik>
  );
};
```

---

## Pages

```typescript
// pages/flights.tsx
export const FlightsPage: FC = () => (
  <PageContent $contain>
    <NextTableProvider context={FlightsTableContext} onFetch={flightsTableFetchUseCase} name='flights-table'>
      <FlightsActionBar />
      <FlightsTable />
    </NextTableProvider>
  </PageContent>
);
```

---

## Router

```typescript
// router/page.router.tsx — registered inside HomeRouter at /flights/*
export const FlightsPageRouter: FC = () => (
  <Routes>
    <Route index element={<FlightsPage />} />
  </Routes>
);

// router/modal.router.tsx — registered at app-level modal layer at /flights/*
export const FlightsModalRouter: FC = () => (
  <Routes>
    <Route path='create' element={<CreateFlight />} />
    <Route path=':id/update' element={<CreateFlight />} />
  </Routes>
);
```

**Registration in main app:**
- `HomeRouter`: add `<Route path='/flights/*' element={<FlightsPageRouter />} />`
- App-level modal Routes: add `<Route path='/flights/*' element={<FlightsModalRouter />} />`

---

## Interfaces & Mappers

### `IFlight` (domain)
```typescript
interface IFlight {
  id: number;
  name: string;
  startedAt: string;
  endedAt: string;
  status: string;
  country: string;
  weight: number;
  count: number;
  declarationCount: number;
  completedDeclarations: number;
  deliveryPrice: number;
  productPrice: number;
  airwaybill: string | null;
  flightProvider: string | null;
}
```

### `FlightMapper`
```typescript
class FlightMapper {
  static toDomain(p: IFlightPersistence): IFlight  // snake_case → camelCase
  static toDetailDomain(p: IFlightByIdPersistence): IFlightById
}
```

---

## Data Flow Summary

```
User clicks "Yeni uçuş"
  → navigate('/flights/create', { withBackground: true })
    → FlightsModalRouter renders CreateFlight as modal overlay
      → useFlightForm() — no id, empty initialValues
        → User fills form, submits
          → FlightsService.createFlight(values)
            → 200: message.success + navigate('/flights?reFetchFlightsTable=1')
              → useFlightsTable detects param → handleFetch() → table refreshes
            → 422: helpers.setErrors → field errors shown under inputs
            → 400/500: message.error toast
```

---

## Migration Template

This module defines the pattern for all 21 remaining missing modules. Each subsequent module follows the same layer order:

1. `interfaces/` — domain types + persistence types
2. `mappers/` — persistence → domain (pure functions)
3. `services/` — `caller()` + `ApiResult`, all endpoints
4. `context/` — `createNextTableContext<IEntity>()`
5. `use-cases/` — table fetch use-case
6. `hooks/` — table columns hook, table hook (with refetch signal), form hook
7. `containers/` — table, action bar, create/update modal
8. `pages/` — `NextTableProvider` wrapper
9. `router/` — `page.router.tsx` + `modal.router.tsx`
10. `index.ts` — barrel export
11. Register both routers in main app

Modules with no create/update (read-only) skip steps 6c (form hook), 7c (create container), and `modal.router.tsx`.
