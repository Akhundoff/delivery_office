import { ChangeEvent } from 'react';

export class InputFormatters {
  public static decimal(event: ChangeEvent<HTMLInputElement>): ChangeEvent<HTMLInputElement> {
    event.target.value = event.target.value.replace(/,/g, '.');
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
    return event;
  }

  public static integer(event: ChangeEvent<HTMLInputElement>): ChangeEvent<HTMLInputElement> {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    return event;
  }
}
