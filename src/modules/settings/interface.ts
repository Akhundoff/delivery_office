export interface ICountry {
  id: number;
  abbr: string;
  name: string;
  unit: string;
}

export interface ISettingsData {
  countries: ICountry[];
  warehouse: string[];
  workinghours: string;
}

export interface ISettings {
  data: ISettingsData | null;
  getCountryCode: (id: string | number | null) => string;
  getCountryId: (country: string) => number | null;
  getCountry: (id: number | string) => ICountry | null;
}

export interface SettingsApi {
  countries: ICountry[];
  warehouse: string[];
  workinghours: string;
}
