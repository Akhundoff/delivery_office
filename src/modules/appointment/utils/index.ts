export function defaultFilterEnabled(): boolean {
  return localStorage.getItem('no_filter_appointment') === 'true';
}
