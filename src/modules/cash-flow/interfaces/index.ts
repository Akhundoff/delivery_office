export type ICurrency = {
    id: number;
    name: string;
    code: string;
    rate: string;
    createdAt: string;
};

export type ICashRegister = {
    id: number;
    name: string;
    amount: number;
    initialAmount: number;
    currency: { id: number; code: string };
    createdAt: string;
};

export type ICashRegisterOperationWithParent = {
    id: number;
    name: string;
    parent: { id: number; name: string } | null;
    createdAt: string;
};

export type ICashRegisterOperationWithSub = {
    id: number;
    name: string;
    children: { id: number; name: string; createdAt: string }[];
    createdAt: string;
};

export type ICashFlowTransaction = {
    id: number;
    executor: { id: number; name: string };
    cashRegister: { id: number; name: string; currency: { id: number; code: string } };
    target: { cashRegister: { id: number; name: string; currency: { id: number; code: string } }; amount: number } | null;
    amount: number;
    balance: { previous: number };
    transferBalance: { previous: number };
    status: { id: number; name: string };
    operation: { id: number; name: string; child: { id: number; name: string } };
    isTransfer: boolean;
    type: 'income' | 'expense';
    paymentType: { id: number; name: string };
    description: string | null;
    operatedAt: string;
    createdAt: string;
};

export type ICashFlowAnalyticsResult = {
    currency: { id: number; code: string };
    categories: {
        id: number;
        name: string;
        income: number;
        expense: number;
        percent: number;
        children: { id: number; name: string; income: number; expense: number; percent: number }[];
    }[];
    total: { income: number; expense: number; percent: number };
};
