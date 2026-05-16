import { Dayjs } from "dayjs";

export interface CreateDiscountDto {
  discount: string;
  discountDate: Dayjs | null;
  countryId: string | null;
  descr: string;
}
