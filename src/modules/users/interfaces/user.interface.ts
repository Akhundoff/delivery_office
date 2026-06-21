export type IUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string | null;
  balance: {
    try: number;
    usd: number;
  };
  branch: {
    id: number | null;
    name: string | null;
  };
  adminCompanyName: string | null;
  birthDate: string | null;
  gender: 'male' | 'female' | null;
  passport: {
    number: string | null;
    secret: string | null;
  };
  isBlocked: boolean;
};

export type IUserPersistence = {
  id: number;
  name: string;
  surname: string;
  address: string | null;
  admin: number;
  balance_courier: string | null;
  branch_id: number | null;
  branch_name: string | null;
  admin_company_name: string | null;
  balance_try: string;
  balance_usd: string;
  birth_date: string | null;
  blocked: number;
  email: string;
  gender: 'male' | 'female' | null;
  last_30_days: null | string;
  number: string | null;
  passport_number: string | null;
  passport_secret: string | null;
};

export type IAppUser = {
  id: number;
  username: string;
};

export type IUserExcel = {
  Kod: number;
  Ad: string;
  Email: string;
  Telefon: string | null;
  BalansTry: number;
  BalansUsd: number;
  Filial: string | null;
  Shirket: string | null;
  'Dogum gunu': string | null;
  Cins: string | null;
  'S.V. nomresi': string | null;
  'FIN kod': string | null;
};
