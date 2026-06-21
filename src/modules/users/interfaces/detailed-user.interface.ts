export type IDiscount = {
  id: number;
  countryId: number;
  countryName: string;
  discount: number;
  causerName: string;
  descr: string;
  discountDate: string;
};

export type IDiscountStat = {
  month: number;
  date: string;
  weight: string;
  quantity: number;
  deliveryPrice: string;
  monthName: string;
};

export type IDetailedUser = {
  id: number;
  firstname: string;
  lastname: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  gender: 'male' | 'female';
  birthDate: string | null;
  address: string | null;
  branch: { id: number | null; name: string | null };
  adminBranchId: number | null;
  adminBranchName: string | null;
  adminCompanyName: string | null;
  passport: { number: string | null; secret: string | null };
  balance: { usd: number; try: number };
  debt: { usd: number; try: number };
  spending: { currentMonth: { usd: number; try: number } };
  cashback: { currentCashback: number; totalCashbackApproved: number; totalCashbackPending: number };
  discounts: IDiscount[];
  counts: {
    declarations: { all: number; handedOver: number };
    couriers: { all: number; handedOver: number };
    orders: { all: number; handedOver: number };
    transactions: { income: number; outcome: number };
  };
  role: 'admin' | 'warehouseman' | 'back-office' | 'partner' | 'user';
  isBlocked: boolean;
  createdAt: string;
  sendSms: boolean;
  sendEmail: boolean;
};

export type IDetailedUserPersistence = {
  data: {
    id: number;
    name: string;
    surname: string;
    user_name: string;
    email: string;
    number: string | null;
    gender: 'male' | 'female';
    birth_date: string | null;
    address: string | null;
    branch_id: number | null;
    branch_name: string | null;
    admin_branch_id: number | null;
    admin_branch_name: string | null;
    admin_company_name: string | null;
    passport_number: string | null;
    passport_secret: string | null;
    admin: number;
    blocked: number;
    created_at: string;
    send_mail: number;
    send_sms: number;
    declaration: { all: number; delivered: number };
    courier: { all: number; delivered: number };
    order: { all: number; delivered: number };
    in: number;
    out: number;
  };
  widget: {
    balance: { usd: number; try: number };
    this: { usd: number; try: number };
  };
  credit: number;
  credit_usd: number;
  cashback?: {
    currentCashback: number;
    totalCashbackApproved: number;
    totalCashbackPending: number;
  };
  discounts?: {
    id: number;
    country_id: number;
    country_name: string;
    discount: number;
    causer_name: string;
    descr: string;
    discount_date: string;
  }[];
};

export type CreateUserDto = {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  gender: 'male' | 'female';
  birthDate: any | null;
  address: string;
  branchId: string;
  passport: {
    number: string;
    secret: string;
  };
  password: string;
  passwordConfirmation: string;
  sendEmail: boolean;
  sendSms: boolean;
};
