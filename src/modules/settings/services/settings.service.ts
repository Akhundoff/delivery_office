import { ApiResult, caller, urlMaker } from '@shared/utils';
import { SettingsApi } from "../interface";

export class SettingsService {
  static async getSettings(): Promise<
    ApiResult<200, SettingsApi> | ApiResult<400 | 500, string>
  > {
    try {
      const url = urlMaker("/api/client/settings");
      const response = await caller(url);

      if (response.ok) {
        const { data } = await response.json();
        return new ApiResult(200, data, null);
      }

      return new ApiResult(400, "Operation failed", null);
    } catch {
      return new ApiResult(500, "Network request failed", null);
    }
  }
}
