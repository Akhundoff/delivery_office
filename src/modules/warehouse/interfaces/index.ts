export type IHandoverQueueDeclaration = {
    id: number;
    trackCode: string;
    wardrobeNumber: string | null;
    box: { id: number; name: string } | null;
};

export type IHandoverQueue = {
    id: number;
    user: { id: number; fullName: string };
    cashier: { id: number; fullName: string };
    declarations: IHandoverQueueDeclaration[];
    status: { id: number; name: string };
    createdAt: string;
};

export type IDetailedHandoverQueueDeclaration = {
    id: number;
    trackCode: string;
    globalTrackCode: string;
    trendyol: number;
    partnerId: number | null;
    wardrobeNumber: string | null;
    box: { id: number; name: string } | null;
    productType: { id: number; name: string } | null;
    shop: string;
    weight: number | null;
};

export type IDetailedHandoverQueue = {
    id: number;
    user: { id: number; fullName: string };
    cashier: { id: number; fullName: string };
    declarations: IDetailedHandoverQueueDeclaration[];
    boxes: { id: number; name: string; items: IDetailedHandoverQueueDeclaration[] }[];
    status: { id: number; name: string };
    packages?: { smallPackage: number; mediumPackage: number; bigPackage: number };
    createdAt: string;
};
