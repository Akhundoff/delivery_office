import { ITicketTemplate, ITicketTemplatePersistence } from '../interfaces';

export class TicketTemplateMapper {
    public static toDomain(p: ITicketTemplatePersistence): ITicketTemplate {
        return {
            id: p.id,
            name: p.title,
            body: p.body,
            createdAt: p.created_at,
        };
    }
}
