export const object2Search = (query: Record<string, unknown>) => {
  const search = new URLSearchParams();

  Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .forEach(([key, value]) => {
      search.append(key, String(value));
    });

  const queryString = search.toString();
  return queryString ? `?${queryString}` : '';
};
