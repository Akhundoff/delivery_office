import { IEmailNotification, IEmailNotificationPersistence } from '../interfaces';

export class EmailNotificationMapper {
    public static toDomain(p: IEmailNotificationPersistence): IEmailNotification {
        return {
            id: p.id,
            body: p.body ?? '',
            email: p.email ?? '',
            userId: p.user_id ?? 0,
            model: { id: p.model_id, name: p.model_name ?? '' },
            objectId: p.object_id,
            params: p.params ? JSON.parse(p.params) : null,
            isActive: !!p.active,
            templateId: p.template_id ?? null,
            isBulk: !!p.bulk,
            sent: !!p.sent,
            retriedAt: p.retry_at,
            sentAt: p.sended_at,
            createdAt: p.created_at,
        };
    }
}
