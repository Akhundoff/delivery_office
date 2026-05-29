import { useCallback, useEffect, useState } from 'react';
import { IFlightById } from '../../interfaces';
import { FlightsService } from '../../services';

export const useFlightById = (id: string) => {
  const [data, setData] = useState<IFlightById | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await FlightsService.getById(id);
    if (result.status === 200) {
      setData(result.data as IFlightById);
    } else {
      setError(result.data as string);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, fetch };
};
