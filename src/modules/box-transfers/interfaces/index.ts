export type BoxTransfersRequestType = 'declaration' | 'container' | 'branch';

export type IBoxTransfer = {
    id: number;
    declaration: { id: number; trackCode: string };
    fromContainer: { id: number; name: string };
    toContainer: { id: number; name: string };
    user: { id: number; name: string };
    branch: { id: number; name: string };
    note: string;
    createdAt: string;
};
