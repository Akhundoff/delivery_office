import { Dayjs } from 'dayjs';

export type IBranchInspection = {
  id: number;
  branchId: number;
  stateId: number;
  note: string;
  deadline: { value: string; left: string };
  startedAt: string | null;
  completedAt: string | null;
  createdBy: number;
  executedBy: number | null;
  createdAt: string;
  updatedAt: string;
  branch: { id: number; name: string };
  state: { id: number; name: string };
  createdByUser: { id: number; name: string };
  executedByUser: { id: number; name: string } | null;
};

export type ICreateInspectionFormValues = {
  branchId: string;
  note: string;
  deadline: Dayjs | null;
};

export interface IScan {
  id: number;
  inspectionId: number;
  declarationId: number;
  trackCode: string | number;
  trendyol: number | null;
  barcode: string | null;
  partnerId: number | null;
  scannedAt: string;
  createdAt: string;
}

export interface IScanItem extends IScan {
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

type ReportField<T> = { value: T; descr: string };

export interface IInspectionReport {
  inspection_id: number;
  expected_parcels_count: ReportField<number>;
  scanned_parcels_count: ReportField<number>;
  correct_parcels_count: ReportField<number>;
  missing_parcels_count: ReportField<number>;
  extra_parcels_count: ReportField<number>;
  foreign_scanned_parcels_count: ReportField<number>;
  missing_parcels_tracks: ReportField<string[]>;
  extra_parcels_tracks: ReportField<string[]>;
  foreign_scanned_parcels_tracks: ReportField<string[]>;
  duration_minutes: ReportField<number>;
  executed_by: { value: number; name: string; descr: string };
  started_at: ReportField<string>;
  completed_at: ReportField<string>;
  created_at: ReportField<string>;
}
