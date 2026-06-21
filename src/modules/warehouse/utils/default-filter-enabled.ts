export function defaultFilterEnabled(): boolean {
  const filter = localStorage.getItem('no_filter_warehouse_check');
  return !!filter && filter === 'true';
}
