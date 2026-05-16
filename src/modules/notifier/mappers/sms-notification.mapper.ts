import { ISmsNotification, ISmsNotificationPersistence } from '../interfaces';

export class SmsNotificationMapper {
    public static toDomain(p: ISmsNotificationPersistence): ISmsNotification {
        return {
            id: p.id,
            body: p.body ?? '',
            phoneNumber: p.number ?? '',
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
