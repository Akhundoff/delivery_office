import { IDetailedUser, IDetailedUserPersistence } from "../interfaces";

const getRoleFromAdmin = (admin: number): IDetailedUser["role"] => {
  switch (admin) {
    case 1:
      return "admin";
    case 2:
      return "warehouseman";
    case 3:
      return "back-office";
    case 4:
      return "partner";
    default:
      return "user";
  }
};

export class DetailedUserMapper {
  public static toDomain(raw: IDetailedUserPersistence): IDetailedUser {
    return {
      id: raw.data.id,
      firstname: raw.data.name,
      lastname: raw.data.surname,
      fullName: raw.data.user_name,
      email: raw.data.email,
      phoneNumber: raw.data.number ?? null,
      gender: raw.data.gender,
      birthDate: raw.data.birth_date ?? null,
      address: raw.data.address ?? null,
      branch: {
        id: raw.data.branch_id ?? null,
        name: raw.data.branch_name ?? null,
      },
      adminBranchId: raw.data.admin_branch_id ?? null,
      adminBranchName: raw.data.admin_branch_name ?? null,
      adminCompanyName: raw.data.admin_company_name ?? null,
      passport: {
        number: raw.data.passport_number ?? null,
        secret: raw.data.passport_secret ?? null,
      },
      balance: {
        usd: raw.widget?.balance?.usd ?? 0,
        try: raw.widget?.balance?.try ?? 0,
      },
      counts: {
        declarations: {
          all: raw.data.declaration?.all ?? 0,
          handedOver: raw.data.declaration?.delivered ?? 0,
        },
        couriers: {
          all: raw.data.courier?.all ?? 0,
          handedOver: raw.data.courier?.delivered ?? 0,
        },
        orders: {
          all: raw.data.order?.all ?? 0,
          handedOver: raw.data.order?.delivered ?? 0,
        },
        transactions: {
          income: raw.data.in ?? 0,
          outcome: raw.data.out ?? 0,
        },
      },
      role: getRoleFromAdmin(raw.data.admin),
      isBlocked: !!raw.data.blocked,
      createdAt: raw.data.created_at,
      sendSms: !!raw.data.send_sms,
      sendEmail: !!raw.data.send_mail,
    };
  }
}
