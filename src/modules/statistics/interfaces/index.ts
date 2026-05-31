export type IDeclarationStatisticByStatus = {
    id: string;
    count: number;
    productPrice: number;
    deliveryPrice: number;
    updatedAt: string;
};

export type IOrderStatisticByStatus = {
    id: string;
    count: number;
    price: number;
    updatedAt: string;
};

export type ITransactionStatisticByUser = {
    id: string;
    count: number;
    amount: number;
    currency: string;
    createdAt: string;
};

export type ITransactionStatisticByUserResult = {
    items: ITransactionStatisticByUser[];
    total: {
        count: number;
        amount: { azn: number; try: number; usd: number };
    };
};

// A lightweight admin/user option (from /api/admin/users/select)
export type IStatisticAdmin = {
    id: number;
    name: string;
};

// Orders by admin
export type IOrderStatisticByAdmin = {
    id: string;
    count: number;
    price: number;
    user: { id: number; name: string };
    updatedAt: string;
};

export type IOrderStatisticByAdminResult = {
    items: IOrderStatisticByAdmin[];
    total: { count: number; price: number };
};

// Users by count
export type IUsersCountStatistic = {
    id: string;
    count: number;
    createdAt: string;
};

export type IUsersCountStatisticsResult = {
    data: IUsersCountStatistic[];
    total: { byAges: { from: number; to: number; count: number }[] };
};

// Couriers by count
export type ICouriersCountStatistic = {
    id: string;
    count: number;
    paymentAmounts: { cash: number; online: number };
    updatedAt: string;
};

export type ICouriersCountStatisticsResult = {
    data: ICouriersCountStatistic[];
    total: { count: number; payments: { cash: number; online: number } };
};

// Couriers by region
export type ICouriersCountByRegionStatistic = {
    id: string;
    region: { id: number; name: string };
    count: number;
    paymentAmount: { azn: number; usd: number };
    updatedAt: string;
};

export type ICouriersCountByRegionStatisticsResult = {
    data: ICouriersCountByRegionStatistic[];
    total: { count: number; paymentAmount: { azn: number; usd: number } };
};

// Couriers by region (overview, aggregated)
export type ICouriersCountByRegionOverviewStatistic = {
    id: string;
    region: { id: number; name: string };
    count: number;
    paymentAmount: { azn: number; usd: number };
};

// Transactions (balance) by payment type
export type ITransactionStatisticByPaymentType = {
    id: string;
    date: string;
    count: number;
    price: string;
    online: string;
    office: string;
};

export type ITransactionStatisticByPaymentTypeResult = {
    data: ITransactionStatisticByPaymentType[];
    total: { count: number; office: number; online: number; price: number };
};

// Cashflow daily transactions
export type ICashFlowDailyTransaction = {
    id: string;
    count: number;
    price: number;
    date: string;
};

export type ICashFlowDailyTransactionsResult = {
    data: ICashFlowDailyTransaction[];
    total: { count: number; price: number };
};

// Payment types by declarations
export type IPaymentTypeStatisticByDeclaration = {
    id: string;
    count: number;
    paymentType: { id: number; name: string };
    deliveryPrice: { usd: number; azn: number };
    paidAt: string;
};

export type IPaymentTypeStatisticByDeclarationResult = {
    data: IPaymentTypeStatisticByDeclaration[];
    total: {
        amount: number;
        declarationCount: number;
        deliveryPrice: number;
        byPaymentTypes: { id: number; name: string; deliveryPrice: number }[];
    };
};

// Tariff overview
export type ITariffOverviewStatistic = {
    id: number;
    count: number;
    totalWeight: number;
    tariffFrom: string;
    tariffTo: string;
    totalDeliveryPrice: number;
    price: string;
    type: string;
};

// Qizil-onluq (golden) users
export type IQizilOnluqUser = {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    qizilonluq: string;
    balance: { try: number; usd: number };
    branch: { id: number; name: string };
    discount: number;
    gender: 'male' | 'female';
};

// Counts grouped by status (declaration / order count modals)
export type ICountsByStatus = {
    id: number;
    name: string;
    count: number;
};

// Users general statistics (widget)
export type IUsersGeneralStatistics = {
    counts: { totalClient: number; orderedClient: number };
    balance: { usd: number; try: number };
};

// Transaction balance statistics
export type ITransactionBalanceStatistics = {
    todayOutcome: { usd: number; try: number };
    todayIncome: { usd: number; try: number };
    balance: { usd: number; try: number };
};
