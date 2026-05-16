import { useEffect } from "react";

export const useDebounceEffect = (cb: Function, time: number) => {
  useEffect(() => {
    const timeout = setTimeout(cb, time);
    return () => {
      clearTimeout(timeout);
    };
  }, [cb, time]);
};
