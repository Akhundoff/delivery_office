// Business constants mirrored from delivery_management (@next/infra/utils/get-country.ts)

export enum CountryIds {
  TURKIYE = 1,
  AMERICA = 2,
  CHINA = 3,
  SPAIN = 4,
}

export enum CurrencySymbols {
  AZN = '₼',
  TRY = '₺',
  USD = '$',
  YEN = '¥',
  EURO = '€',
}

const CURRENCIES: Record<number, CurrencySymbols> = {
  [CountryIds.TURKIYE]: CurrencySymbols.TRY,
  [CountryIds.AMERICA]: CurrencySymbols.USD,
  [CountryIds.CHINA]: CurrencySymbols.USD,
  [CountryIds.SPAIN]: CurrencySymbols.EURO,
};

export const getCurrencySymbolByCountryId = (id: string | number | null | undefined): string => {
  if (!id) return '';
  return CURRENCIES[Number(id)] || CURRENCIES[CountryIds.AMERICA];
};

export const getCurrencySymbol = (currency: string | null | undefined): string => {
  if (!currency) return '';
  switch (currency.toUpperCase()) {
    case 'USD':
      return CurrencySymbols.USD;
    case 'TRY':
      return CurrencySymbols.TRY;
    case 'AZN':
      return CurrencySymbols.AZN;
    case 'AVRO':
      return CurrencySymbols.EURO;
    default:
      return currency;
  }
};

// Status that represents a rejected/cancelled order — opens the rejection-reason modal.
export const REJECTED_STATUS_ID = 4;

// Coupon labels mirrored from delivery_management (@next/modules/coupons/constants)
export const CouponTags: Record<number, string> = {
  1: 'Balans artımı',
  2: 'Sifariş xidmətində əlavə faiz',
  3: 'Çatdırılma xidmətinə endirim',
  4: 'Kuryer xidmətinə endirim',
};
