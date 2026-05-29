export type IUnitedReturn = {
  id: number;
  barcode: string;
  weight: string;
  state: { id: number | null; name: string };
  branch: { id: number | null; name: string };
  labelUrl: string;
  note: string;
  createdAt: string;
};

export type IUnitedReturnFormValues = {
  barcode: string;
  weight: string;
};

export enum UnitedReturnStatusType {
  READY = '153',
}
