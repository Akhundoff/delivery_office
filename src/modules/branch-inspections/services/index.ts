import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IBranchInspection, IInspectionReport, IScan } from '../interfaces';

const toDomain = (p: any): IBranchInspection => ({
  id: p.id,
  branchId: p.branch_id,
  stateId: p.state_id,
  note: p.note ?? '',
  deadline: p.deadline || { value: '', left: '' },
  startedAt: p.started_at || null,
  completedAt: p.completed_at || null,
  createdBy: p.created_by,
  executedBy: p.executed_by || null,
  createdAt: p.created_at || '',
  updatedAt: p.updated_at || '',
  branch: p.branch || { id: 0, name: '' },
  state: p.state || { id: 0, name: '' },
  createdByUser: p.created_by_user || { id: 0, name: '' },
  executedByUser: p.executed_by_user || null,
});

const scanToDomain = (s: any): IScan => ({
  id: s.id,
  inspectionId: s.inspection_id,
  declarationId: s.declaration_id,
  trackCode: s.track_code,
  trendyol: s.trendyol ?? null,
  barcode: s.barcode ?? null,
  partnerId: s.partner_id ?? null,
  scannedAt: s.scanned_at,
  createdAt: s.created_at,
});

export const BranchInspectionsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IBranchInspection[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/branch_inspections', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: (result.data || []).map(toDomain), total: result.meta?.total ?? result.total ?? 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getById: async (id: string): Promise<ApiResult<200, IBranchInspection> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/branch_inspections/${id}`);
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDomain(result.data ?? result), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  create: async (data: { branch_id: number; note?: string; deadline?: string }): Promise<ApiResult<200, IBranchInspection> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/branch_inspections');
    const body = new FormData();
    body.append('branch_id', String(data.branch_id));
    if (data.note) body.append('note', data.note);
    if (data.deadline) body.append('deadline', data.deadline);
    try {
      const response = await caller(url, { method: 'POST', body });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return new ApiResult(200, toDomain(result.data), null);
      if (response.status === 422) return new ApiResult(400, Object.values(result.errors || {}).flat().join(', ') || 'Validasiya xətası', null);
      return new ApiResult(400, result?.message || 'Yoxlanış yaradıla bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  changeStatus: async (id: string, stateId: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/branch_inspections/${id}/status`);
    const body = new FormData();
    body.append('state_id', String(stateId));
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json().catch(() => ({}));
      if (response.status === 422) return new ApiResult(400, Object.values(result.errors || {}).flat().join(', ') || 'Status dəyişdirilə bilmədi', null);
      return new ApiResult(400, result?.message || 'Status dəyişdirilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getScans: async (id: string): Promise<ApiResult<200, IScan[]> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/branch_inspections/${id}/scans`, { sort_order: 'desc', sort_column: 'id' });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map(scanToDomain), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  scanTrackingCode: async (id: string, trackCode: string): Promise<ApiResult<200, IScan> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/branch_inspections/${id}/scan`);
    const body = new FormData();
    body.append('track_code', trackCode);
    try {
      const response = await caller(url, { method: 'POST', body });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return new ApiResult(200, scanToDomain(result.data), null);
      if (response.status === 422) return new ApiResult(400, Object.values(result.errors || {}).flat().join(', ') || 'Məlumat əlavə edilə bilmədi', null);
      return new ApiResult(400, result?.message || 'Məlumat əlavə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getReport: async (id: string): Promise<ApiResult<200, IInspectionReport> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/branch_inspections/${id}/report`);
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, result.data, null);
      }
      return new ApiResult(400, 'Hesabat əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  exportReport: async (id: string): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/branch_inspections/${id}/export`);
    try {
      const response = await caller(url);
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Excel faylı yaradıla bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },
};
