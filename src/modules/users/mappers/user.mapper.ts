import dayjs from 'dayjs';
import { IUser, IUserExcel, IUserPersistence, CreateUserDto, CreateDiscountDto } from '../interfaces';

export class UserMapper {
  public static toPersistence(dto: CreateUserDto, id?: string | number): Record<string, any> {
    return {
      ...(id != null ? { user_id: String(id) } : {}),
      name: dto.firstname,
      surname: dto.lastname,
      email: dto.email,
      number: dto.phoneNumber,
      gender: dto.gender,
      birth_date: dto.birthDate ? dayjs(dto.birthDate).format('YYYY-MM-DD') : undefined,
      address: dto.address,
      branch_id: dto.branchId,
      passport_number: dto.passport.number,
      passport_secret: dto.passport.secret,
      password: dto.password,
      password_confirmation: dto.passwordConfirmation,
      send_mail: Number(dto.sendEmail).toString(),
      send_sms: Number(dto.sendSms).toString(),
    };
  }

  public static discountToPersistence(userId: string | number, dto: CreateDiscountDto): Record<string, any> {
    return {
      user_id: String(userId),
      discount: dto.discount,
      discount_date: dto.discountDate ? dayjs(dto.discountDate).format('YYYY-MM-DD') : undefined,
      country_id: dto.countryId,
      descr: dto.descr,
    };
  }

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
      'Dogum gunu': user.birth_date,
      BalansTry: parseFloat(user.balance_try) || 0,
      BalansUsd: parseFloat(user.balance_usd) || 0,
      'S.V. nomresi': user.passport_number,
      'FIN kod': user.passport_secret,
      Shirket: user.admin_company_name?.replaceAll('"', '') || null,
      Filial: user.branch_name?.replaceAll('"', '') || null,
    };
  }
}
