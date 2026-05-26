import { Dayjs } from 'dayjs';

export type IFlight = {
  id: number;
  name: string;
  startedAt: string;
  endedAt: string | null;
  declarationCount: number;
  deliveryPrice: number;
  productPrice: number;
  airwaybill: string;
  count: number;
  completedDeclarations: number;
  status: { id: number; name: string };
  country: { id: number; name: string };
  weight: number;
  trendyol?: number;
  flightProvider: string;
};

export type IFlightPersistence = {
  id: number;
  name: string;
  start_date: string;
  end_date: string | null;
  count: number;
  delivery_price: string;
  price: string;
  airwaybill: string;
  finished: number;
  state_id: number;
  state_name: string;
  country_id: number;
  country_name: string;
  total: number;
  weight: string;
  trendyol?: number;
  flight_provider: string;
};

export type IFlightById = {
  id: number;
  name: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string | null;
  total: number;
  status: { id: number; name: string };
  country: { id: number; name: string };
  completedDeclarations: number;
  airwaybill: string;
  trendyol: number;
  weight: number;
  volume: number;
  deliveryPrice: number;
  productPrice: number;
};

export type IFlightByIdPersistence = {
  id: number;
  name: string;
  price: number;
  delivery_price: number;
  start_date: string;
  end_date: string | null;
  state_id: number;
  state_name: string;
  created_at: string | null;
  total: number;
  finished: number;
  airwaybill: string;
  country_id: number;
  country_name: string;
  trendyol: number;
  weight: number;
  volume: number;
};

export type CreateFlightDto = {
  name: string;
  startedAt: Dayjs;
  endedAt: Dayjs | null;
  statusId: string;
  countryId: number | null;
};

export type CloseFlightDto = {
  id: string;
  type: 'with-dispatch' | 'without-dispatch' | 'all';
  airWaybillNumber: string;
  packagingLimit: string;
};

export type UpdateAirWaybillDto = {
  id: number | string;
  airWaybill: string;
};

export type UpdateCurrentMonthDto = {
  id: string;
  currentMonth: import('dayjs').Dayjs | null;
};
