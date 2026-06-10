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
      couponId: d.coupon_id,
      deliveryPrice: d.delivery_price ? parseFloat(d.delivery_price) : null,
      parcel: d.box ? { id: d.box } : null,
      parcelSorting: { id: d.parcel_sorting_id ?? null, state_name: d.parcel_sorting_state_name ?? null, created_at: d.parcel_sorting_created_at ?? null },
      basket: d.basket_id
        ? { id: d.basket_id, name: d.basket_name || "" }
        : null,
      box:
        d.container_id && d.container_name
          ? { id: d.container_id, name: d.container_name }
          : null,
      lastBox:
        d.container_id_tmp && d.container_name_tmp
          ? { id: d.container_id_tmp, name: d.container_name_tmp }
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
      customsData: d.customs_data,
      locationName: d.branch_name || "",
      locationId: d.branch_id || 0,
      causerId: d.causer_id || 0,
      deliveryPoint: d.delivery_point_id
        ? { id: d.delivery_point_id, name: d.delivery_point_name || "" }
        : null,
      trendyol: d.trendyol,
      trendyolLogs: d.trendyol_logs
        ? {
            invoice: {
              invoicePrice: d.trendyol_logs.invoice?.invoice_price || 0,
              invoiceUrl: d.trendyol_logs.invoice?.invoice_url || "",
            },
            products: { sku: d.trendyol_logs.products?.sku || "" },
            customsStatus: d.trendyol_logs.customs_status || "",
            zipCode: d.trendyol_logs.zip_code || "",
            phoneNumber: d.trendyol_logs.phone_number || "",
            weight: d.trendyol_logs.weight || "",
            smsCount: d.trendyol_logs.sms_count || 0,
            smsDate: d.trendyol_logs.sms_date || "",
            state: d.trendyol_logs.state || "",
            trendyolDeliveryNumber: d.trendyol_logs.trendyol_delivery_number || "",
            warehouseId: d.trendyol_logs.warehouse_id || "",
            type: d.trendyol_logs.type || "",
            unitPrice: d.trendyol_logs.unit_price || "",
            volume: d.trendyol_logs.volume || 0,
            name: d.trendyol_logs.name || "",
            parcelId: d.trendyol_logs.parcel_id || "",
            pinCode: d.trendyol_logs.pin_code || "",
            quantity: d.trendyol_logs.quantity || 0,
            shippingAddress: d.trendyol_logs.shipping_address || "",
            category: d.trendyol_logs.category || "",
            city: d.trendyol_logs.city || "",
            comment: d.trendyol_logs.comment || "",
            createdAt: d.trendyol_logs.created_at || "",
            declarationId: d.trendyol_logs.declaration_id || "",
            domesticCargoCompany: d.trendyol_logs.domestic_cargo_company || "",
            emailAddress: d.trendyol_logs.email_address || "",
            fullName: d.trendyol_logs.full_name || "",
            isDoor: d.trendyol_logs.is_door === 1,
            isDeclared: d.trendyol_logs.is_declared === 1,
            isLiquid: d.trendyol_logs.is_liquid === 1,
            isMicro: d.trendyol_logs.is_micro === 1,
            uid: d.trendyol_logs.uid?.join(", ") || "",
            barcode: d.trendyol_logs.barcode || "",
          }
        : null,
      bbs: { user: d.who_added_bbs, date: d.when_added_bbs },
      handoverTaskId: d.handover_task_id,
      partnerName: d.partner_name || "",
      partnerId: d.partner_id || null,
    };
  }
}
