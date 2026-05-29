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
