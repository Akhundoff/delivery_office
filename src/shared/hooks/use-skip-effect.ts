import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export const useSkipEffect = (effect: EffectCallback, deps: DependencyList): void => {
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
