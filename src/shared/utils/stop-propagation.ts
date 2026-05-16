import { MouseEvent } from 'react';

export const stopPropagation = (cb?: (event: MouseEvent) => void) => (event: MouseEvent) => {
  event.stopPropagation();
  return cb ? cb(event) : undefined;
};
