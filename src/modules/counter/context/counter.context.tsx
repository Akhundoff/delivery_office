import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { MeContext } from '@modules/me/context/context';
import { CounterService } from '../services';
import { ICounter } from '../interfaces';

const initialState: ICounter = {
  couriers: 0,
  orders: 0,
  declarations: 0,
  unknownDeclarations: 0,
  supports: 0,
  handoverQueue: { pending: 0, executing: 0, executed: 0 },
  byBranch: {},
};

export type CounterContextValue = {
  state: ICounter;
  onMouseEnter: () => void;
};

export const CounterContext = createContext<CounterContextValue>({
  state: initialState,
  onMouseEnter: () => {},
});

export const CounterProvider: FC<PropsWithChildren> = ({ children }) => {
  const { state: meState } = useContext(MeContext);
  const lastRequestTime = useRef<number>(0);
  const [hovered, setHovered] = useState<boolean>(false);

  const { data, isFetching, refetch } = useQuery<ICounter, Error>(
    ['counter'],
    async () => {
      const result = await CounterService.getCount();
      if (result.status === 200) return result.data as ICounter;
      throw new Error(result.data as string);
    },
    {
      enabled: !!meState.user.data,
      initialData: initialState,
    },
  );

  const onMouseEnter = useCallback(() => {
    if (isFetching) return;

    const currentTime = Date.now();
    if (currentTime - lastRequestTime.current >= 3000) {
      setHovered(true);
      lastRequestTime.current = currentTime;
      if (hovered) {
        refetch();
      }
    }
  }, [isFetching, hovered, refetch]);

  const value = useMemo<CounterContextValue>(() => ({ state: data ?? initialState, onMouseEnter }), [data, onMouseEnter]);

  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
};
