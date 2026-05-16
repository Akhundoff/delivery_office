import { INotificationTemplate, INotificationTemplatePersistence } from '../interfaces';

export class NotificationTemplateMapper {
    public static toDomain(p: INotificationTemplatePersistence): INotificationTemplate {
        return {
            id: p.id,
            name: p.name ?? '',
            title: p.title ?? '',
            body: p.body ?? '',
            htmlTemplateId: p.html_template_id,
            model: { id: p.model_id, name: p.model_name ?? '' },
            status: p.state_id && p.state_name ? { id: p.state_id, name: p.state_name } : null,
            planCategory: p.tariff_category_id && p.tariff_category_name ? { id: p.tariff_category_id, name: p.tariff_category_name } : null,
            type: { id: p.template_type_id, name: p.template_type_name ?? '' },
            isActive: !!p.active,
            delay: p.delay ?? 0,
            createdAt: p.created_at,
        };
    }
}
