import { object2Search } from './object-to-search';

export const urlMaker = (pathname: string, params: Record<string, unknown> = {}) => {
  const host: string = process.env.REACT_APP_API_HOST || '';
  const queryParams: string = object2Search(params);
  return host + pathname + queryParams;
};
