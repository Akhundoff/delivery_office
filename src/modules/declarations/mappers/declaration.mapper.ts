import { IDeclaration, IDeclarationPersistence } from "../interfaces";

export class DeclarationMapper {
  public static toDomain(d: IDeclarationPersistence): IDeclaration {
    return {
      id: d.id,
      awb: d.awb,
      globalTrackCode: d.global_track_code,
      trackCode: d.track_code,
      requiresDeclaration: d.requires_declaration,
      editable: !!d.editable,
      weight: d.weight ? parseFloat(d.weight) : null,
      height: d.height ? parseFloat(d.height) : null,
      width: d.width ? parseFloat(d.width) : null,
      depth: d.depth ? parseFloat(d.depth) : null,
      price: d.price ? parseFloat(d.price) : null,
      currency: d.currency || null,
      canAccommodate: d.can_accommodate,
      voen: d.voen,
      deliveryPrice: d.delivery_price ? parseFloat(d.delivery_price) : null,
      parcel: d.box ? { id: d.box } : null,
      basket: d.basket_id
        ? { id: d.basket_id, name: d.basket_name || "" }
        : null,
      box:
        d.container_id && d.container_name
          ? { id: d.container_id, name: d.container_name }
          : null,
      branch: d.branch_id
        ? { id: d.branch_id, name: d.branch_name || "" }
        : null,
      quantity: d.quantity,
      type: d.type === 1 ? "liquid" : "other",
      shop: d.shop_name,
      file: d.document_file,
      planCategory: { id: d.tariff_category_id, name: d.tariff_category_name },
      status: { id: d.state_id, name: d.state_name },
      productType: { id: d.product_type_id, name: d.product_type_name },
      user: { id: d.user_id, name: d.user_name },
      description: d.descr || "",
      read: !!d.is_new,
      createdAt: d.created_at,
      deliveredAt: d.delivered_at,
      isCommercial: !!d.is_commercial,
      paid: !!d.payed,
      approved: !!d.customs,
      returned: !!d.return,
      isWanted: !!d.is_wanted,
      wantedDescription: d.wanted_description || "",
      document: d.document_file,
      flight: d.flight_name
        ? { id: d.flight_id || 0, name: d.flight_name }
        : null,
      countryId: d.country_id,
      wardrobeNumber: d.wardrobe_number,
      isYourBranch: d.is_your_branch || false,
      customs: d.customs,
      locationName: d.branch_name || "",
      locationId: d.branch_id || 0,
      causerId: d.causer_id || 0,
      deliveryPoint: d.delivery_point_id
        ? { id: d.delivery_point_id, name: d.delivery_point_name || "" }
        : null,
      handoverTaskId: d.handover_task_id,
      partnerName: d.partner_name || "",
      partnerId: d.partner_id || null,
    };
  }
}
