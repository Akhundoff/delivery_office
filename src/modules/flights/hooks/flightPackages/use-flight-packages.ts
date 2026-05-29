import { useCallback, useEffect, useState } from 'react';
import { IFlightPackage } from '../../interfaces';
import { FlightsService } from '../../services';

export const useFlightPackages = (flightId: string) => {
  const [data, setData] = useState<IFlightPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await FlightsService.getPackages(flightId);
    if (result.status === 200) {
      setData(result.data as IFlightPackage[]);
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
