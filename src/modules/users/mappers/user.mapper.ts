import { IUser, IUserExcel, IUserPersistence } from "../interfaces";

export class UserMapper {
  public static toDomain(user: IUserPersistence): IUser {
    return {
      id: user.id,
      firstname: user.name,
      lastname: user.surname,
      email: user.email,
      phoneNumber: user.number ?? null,
      balance: {
        usd: parseFloat(user.balance_usd) || 0,
        try: parseFloat(user.balance_try) || 0,
      },
      branch: {
        id: user.branch_id ?? null,
        name: user.branch_name ?? null,
      },
      adminCompanyName: user.admin_company_name ?? null,
      birthDate: user.birth_date ?? null,
      gender: user.gender ?? null,
      passport: {
        number: user.passport_number ?? null,
        secret: user.passport_secret ?? null,
      },
      isBlocked: !!user.blocked,
    };
  }

  public static toExcel(user: IUserPersistence): IUserExcel {
    return {
      Kod: user.id,
      Ad: `${user.name} ${user.surname}`,
      Email: user.email,
      Telefon: user.number,
      Cins: user.gender,
      "Dogum gunu": user.birth_date,
      BalansTry: parseFloat(user.balance_try) || 0,
      BalansUsd: parseFloat(user.balance_usd) || 0,
      "S.V. nomresi": user.passport_number,
      "FIN kod": user.passport_secret,
      Shirket: user.admin_company_name?.replaceAll('"', "") || null,
      Filial: user.branch_name?.replaceAll('"', "") || null,
    };
  }
}
