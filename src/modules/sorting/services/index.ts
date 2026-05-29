import { ApiResult, caller, urlMaker } from '@shared/utils';
import { INonSortedDeclaration, ISorting, ISortingDeclaration, ITransferInfo } from '../interfaces';

const sortingToDomain = (s: any): ISorting => ({
  id: s.id,
  parcel: { must: s.parcel_must, count: s.parcel_count, lack: s.parcel_lack },
  userId: s.user_id,
  branchName: s.branch_name,
  state: { id: s.state_id, name: s.state_name },
  isDraft: !!s.is_draft,
  isSendAzeriexpress: !!s.is_send_azeriexpress,
  createdAt: s.created_at,
  accepted: s.accepted,
});

const declarationToDomain = (d: any): ISortingDeclaration => ({
  id: d.track_code,
  trackCode: d.track_code,
  user: { id: d.user_id, name: d.user_name },
  flight: { id: d.flight_id, name: d.flight_name },
  branch: { id: d.branch_id, name: d.branch_name },
  declarationId: d.declaration_id,
  declarationState: { id: d.declaration_state_id, name: d.declaration_state_name },
  sortingState: { id: d.sorting_state_id, name: d.sorting_state_name },
});

const nonSortedToDomain = (d: any): INonSortedDeclaration => ({
  id: d.declaration_id,
  declarationId: d.declaration_id,
  trackCode: d.track_code,
  user: { id: d.user_id, name: d.user_name },
  branch: { id: d.branch_id, name: d.branch_name },
});

const transferInfoToDomain = (t: any): ITransferInfo => ({
  id: t.id,
  state: { id: t.state_id, name: t.state_name },
  branch: { id: t.branch_id, name: t.branch_name },
  user: { id: t.user_id },
  declaration: {
    all: t.all_declarations,
    missing: t.missing,
    thisFlight: t.this_flights_declarations,
    anotherFlight: t.another_flight_declarations,
    count: t.declarations,
  },
  flights: (t.flights || []).map((f: any) => ({
    id: f.id,
    flightId: f.flight_id,
    flightName: f.flight_name,
    totalDeclarations: f.total_declarations,
    notSortingDeclarations: f.not_in_sorting,
    sortingDeclarations: f.in_sorting,
  })),
  isSendAzeriExpress: !!t.is_send_azeriexpress,
});

const listResult = <T>(mapper: (x: any) => T) => async (url: string): Promise<ApiResult<200, { data: T[]; total: number }> | ApiResult<400, string>> => {
  try {
    const response = await caller(url);
    if (response.ok) {
      const result = await response.json();
      return new ApiResult(200, { data: (result.data || []).map(mapper), total: result.total || 0 }, null);
    }
    return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
  } catch {
    return new ApiResult(400, 'Şəbəkə xətası', null);
  }
};

export const SortingService = {
  getList: (query: Record<string, any> = {}) => listResult(sortingToDomain)(urlMaker('/api/admin/sorting/list', { page: 1, per_page: 20, ...query })),

  getDeclarations: (query: Record<string, any> = {}) => listResult(declarationToDomain)(urlMaker('/api/admin/sorting/declarations', { page: 1, per_page: 20, ...query })),

  getAnotherDeclarations: (query: Record<string, any> = {}) => listResult(declarationToDomain)(urlMaker('/api/admin/sorting/another_declarations', { page: 1, per_page: 20, ...query })),

  getMissingDeclarations: (query: Record<string, any> = {}) => listResult(declarationToDomain)(urlMaker('/api/admin/sorting/missing_declarations', { page: 1, per_page: 20, ...query })),

  getNonSortedDeclarations: (query: Record<string, any> = {}) => listResult(nonSortedToDomain)(urlMaker('/api/admin/sorting/nonsorted_declarations', { page: 1, per_page: 20, ...query })),

  getTransferInfo: async (id: string | number): Promise<ApiResult<200, ITransferInfo> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/sorting/transfer_info', { parcel_sorting_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, transferInfoToDomain(result.data ?? result), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  create: async (branchId: string, flightIds: string[]): Promise<ApiResult<200, { id: number; message: string }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/sorting/create', { branch_id: branchId, flight_id: flightIds });
    try {
      const response = await caller(url, { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return new ApiResult(200, { id: result.data?.id ?? result.id, message: result.message || 'Göndəriş yaradıldı' }, null);
      return new ApiResult(400, result?.message || 'Göndəriş yaradıla bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  addToTransfer: async (parcelSortingId: number, trackCode: string, parcelType: number): Promise<ApiResult<200, { isThisFlight: boolean; isFlightAdded: boolean }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/sorting/add_to_transfer', { track_code: trackCode, parcel_sorting_id: parcelSortingId, parcel_type: parcelType });
    try {
      const response = await caller(url, { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return new ApiResult(200, { isThisFlight: !!result.is_this_flight, isFlightAdded: !!result.is_flight_added }, null);
      return new ApiResult(400, result?.message || 'Bağlama əlavə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  removeFromTransfer: async (parcelSortingId: number, trackCode: string | number): Promise<ApiResult<200, { isFlightRemoved: boolean; message: string }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/sorting/remove_from_transfer', { track_code: trackCode, parcel_sorting_id: parcelSortingId });
    try {
      const response = await caller(url, { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return new ApiResult(200, { isFlightRemoved: !!result.is_flight_removed, message: result.message || 'Silindi' }, null);
      return new ApiResult(400, result?.message || 'Bağlama silinə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  truncateTransfer: async (parcelSortingId: number): Promise<ApiResult<200, { isFlightRemoved: boolean; message: string }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/sorting/truncate_transfer', { parcel_sorting_id: parcelSortingId });
    try {
      const response = await caller(url, { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return new ApiResult(200, { isFlightRemoved: !!result.is_flight_removed, message: result.message || 'Boşaldıldı' }, null);
      return new ApiResult(400, result?.message || 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  send: async (id: number): Promise<ApiResult<200, string> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/sorting/send', { parcel_sorting_id: id });
    try {
      const response = await caller(url, { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return new ApiResult(200, result.message || 'Göndərildi', null);
      return new ApiResult(400, result?.message || 'Göndərilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  transferToFlyex: async (id: number): Promise<ApiResult<200, string> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/flyex/start-transfer', { parcel_sorting_id: id });
    try {
      const response = await caller(url, { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return new ApiResult(200, result.message || 'Flyex-ə göndərildi', null);
      return new ApiResult(400, result?.message || 'Flyex-ə göndərilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getSelectFlights: async (): Promise<ApiResult<200, { id: number; name: string }[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/flights/select');
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map((f: any) => ({ id: f.id, name: f.flight_name || f.name || '' })), null);
      }
      return new ApiResult(400, 'Uçuşlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },
};
