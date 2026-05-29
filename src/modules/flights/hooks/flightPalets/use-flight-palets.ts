import { useCallback, useEffect, useState } from 'react';
import { IFlightPalet } from '../../interfaces';
import { FlightsService } from '../../services';

export const useFlightPalets = (flightId?: string | number) => {
  const [data, setData] = useState<IFlightPalet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await FlightsService.getPalets(flightId);
    if (result.status === 200) {
      setData(result.data as IFlightPalet[]);
    } else {
      setError(result.data as string);
    }
    setLoading(false);
  }, [flightId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, fetch };
};
