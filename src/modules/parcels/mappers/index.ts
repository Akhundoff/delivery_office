import { IParcel, IParcelPersistence } from '../interfaces';

export class ParcelMapper {
  public static toDomain(parcel: IParcelPersistence): IParcel {
    return {
      id: parcel.id,
      name: parcel.box,
    };
  }
}
