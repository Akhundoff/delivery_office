export type ITicketTemplate = {
    id: number;
    name: string;
    body: string;
    createdAt: string;
};

export type ITicketTemplatePersistence = {
    id: number;
    title: string;
    body: string;
    created_at: string;
};

export type ICreateTicketTemplateDto = {
    id?: number;
    name: string;
    body: string;
};
