import { FC, useCallback, useState } from 'react';
import { Button, message } from 'antd';
import { useQuery } from 'react-query';
import { FlightsService } from '../services';

export const FlightDimensionalWeightCell: FC<{ row: { original: { id: number } } }> = ({ row }) => {
  const [calculate, setCalculate] = useState(false);

  const onClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCalculate(true);
  }, []);

  const { data, isLoading } = useQuery(
    ['flights', row.original.id, 'dimensional-weight'],
    () =>
      FlightsService.getFlightDimensionalWeight(row.original.id).then((r) => {
        if (r.status === 200) return r.data;
        throw new Error(r.data as string);
      }),
    {
      enabled: calculate,
      onError: (e: Error) => {
        setCalculate(false);
        message.error(e.message);
      },
    },
  );

  if (data) return <span>{data.weight.toFixed(2)} kq</span>;

  return (
    <Button size="small" loading={isLoading} onClick={onClick} type="link">
      Hesabla
    </Button>
  );
};
