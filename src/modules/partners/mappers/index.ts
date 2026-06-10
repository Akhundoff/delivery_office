import { IPartner, IPartnerPersistence } from '../interfaces';

export class PartnerMapper {
  public static toDomain(item: IPartnerPersistence): IPartner {
    return {
      id: item.id,
      name: item.name,
      ip: item.ip,
      state: { id: item.state_id, name: item.state_name },
      description: item.descr,
      createdAt: item.created_at,
    };
  }
}
