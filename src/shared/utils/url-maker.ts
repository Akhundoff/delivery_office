import { object2Search } from './object-to-search';

export const urlMaker = (pathname: string, params: Record<string, unknown> = {}) => {
  const host: string = process.env.REACT_APP_API_HOST || '';
  const queryParams: string = object2Search(params);
  return host + pathname + queryParams;
};

export const localURLMaker = (pathname: string, params: Record<string, string | number> = {}, query: Record<string, any> = {}) => {
  const filledPathname = Object.entries(params)
    .filter(([, value]) => !!value)
    .reduce((acc, [key, value]) => acc.replace(':' + key, value.toString()), pathname);

  const queryString = object2Search(query);
  return filledPathname + queryString;
};

export const staticFileUrl = (fileName: string): string => {
  return urlMaker(localURLMaker('/storage/files/:fileName', { fileName }));
};
