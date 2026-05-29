import { useCallback, useEffect, useState } from 'react';
import { IFlightAirWaybill } from '../../interfaces';
import { FlightsService } from '../../services';

export const useFlightAirWaybills = (flightId: string) => {
  const [data, setData] = useState<{ packages: IFlightAirWaybill[]; totalWeight: number; count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await FlightsService.getAirWaybills(flightId);
    if (result.status === 200) {
      setData(result.data as { packages: IFlightAirWaybill[]; totalWeight: number; count: number });
    } else {
      setError(result.data as string);
    }
    setLoading(false);
  }, [flightId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error };
};
