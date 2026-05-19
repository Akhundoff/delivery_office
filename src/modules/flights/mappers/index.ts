import { IFlight, IFlightPersistence, IFlightById, IFlightByIdPersistence, CreateFlightDto, CloseFlightDto } from '../interfaces';
import { FormikErrors } from 'formik';

export class FlightMapper {
  public static toDomain(data: IFlightPersistence): IFlight {
    return {
      id: data.id,
      name: data.name,
      startedAt: data.start_date,
      endedAt: data.end_date,
      declarationCount: data.total,
      count: data.count,
      deliveryPrice: parseFloat(data.delivery_price) || 0,
      productPrice: parseFloat(data.price) || 0,
      airwaybill: data.airwaybill,
      completedDeclarations: data.finished,
      weight: parseFloat(data.weight) || 0,
      country: { id: data.country_id, name: data.country_name },
      status: { id: data.state_id, name: data.state_name },
      trendyol: data.trendyol,
      flightProvider: data.flight_provider,
    };
  }

  public static toDetailDomain(data: IFlightByIdPersistence): IFlightById {
    return {
      id: data.id,
      name: data.name,
      startedAt: data.start_date,
      endedAt: data.end_date,
      createdAt: data.created_at,
      total: data.total,
      status: { id: data.state_id, name: data.state_name },
      country: { id: data.country_id, name: data.country_name },
      completedDeclarations: data.finished,
      airwaybill: data.airwaybill,
      trendyol: data.trendyol,
      weight: data.weight,
      volume: data.volume,
      deliveryPrice: data.delivery_price,
      productPrice: data.price,
    };
  }
}

export class CreateFlightDtoMapper {
  public static toPersistence(dto: CreateFlightDto): Record<string, any> {
    return {
      name: dto.name,
      start_date: dto.startedAt.format('YYYY-MM-DD'),
      end_date: dto.endedAt?.format('YYYY-MM-DD') || '',
      state_id: dto.statusId,
      country_id: dto.countryId,
    };
  }

  public static errsToDomain(errors: Record<string, string[]>): FormikErrors<CreateFlightDto> {
    return {
      name: errors.name?.join('. '),
      startedAt: errors.start_date?.join('. '),
      endedAt: errors.end_date?.join('. '),
      statusId: errors.state_id?.join('. '),
      countryId: errors.country_id?.join('. '),
    };
  }
}

export class CloseFlightDtoMapper {
  public static toPersistence(dto: CloseFlightDto): Record<string, any> {
    return {
      flight_id: dto.id,
      airWaybill: dto.airWaybillNumber,
      limit: dto.packagingLimit,
    };
  }

  public static errsToDomain(errors: Record<string, string[]>): FormikErrors<CloseFlightDto> {
    return {
      id: errors.flight_id?.join('. '),
      airWaybillNumber: errors.airWaybill?.join('. '),
      packagingLimit: errors.limit?.join('. '),
    };
  }
}
