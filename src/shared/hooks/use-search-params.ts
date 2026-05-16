import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';
import { useBackgroundNavigate } from './use-background-navigate';

export const useSearchParams = <T = Record<string, string>>() => {
  const remove = useRef<(name: string) => void>(() => {});
  const location = useLocation();
  const navigate = useBackgroundNavigate();

  const searchParams = useMemo<T>(() => {
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(params.entries()) as unknown as T;
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    remove.current = (name: string) => {
      params.delete(name);
      navigate({ pathname: '', search: params.toString() });
    };
  }, [navigate, location.search]);

  return { searchParams, remove };
};
