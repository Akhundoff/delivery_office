import Cookies from 'js-cookie';

export const caller = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  const accessToken: string | null = Cookies.get('accessToken') || null;

  const additionalHeaders: HeadersInit = {
    Accept: 'application/json',
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
    lang: localStorage.getItem('i18nextLng') || 'az',
  };

  const countryId = localStorage.getItem('warehouse.country_id');
  if (countryId) {
    additionalHeaders['country-id'] = countryId;
  }

  const finalInit: RequestInit = {
    ...init,
    headers: {
      ...(init ? init.headers : {}),
      ...additionalHeaders,
    },
  };

  return fetch(input, finalInit);
};
