import { useContext, useEffect, useRef } from 'react';
import { useCounter } from '@modules/counter';
import { HandoverQueuesTableContext } from '../../context';

/**
 * Replaces the old `@counter/handoverQueue/changed` event-bus signal.
 * When the counter's handover-queue counts change (the counter polls them on
 * sidebar hover), the queues list is refreshed via the NextTable's handleFetch.
 */
export const useHandoverQueueCounterSync = () => {
  const { state: counter } = useCounter();
  const { handleFetch } = useContext(HandoverQueuesTableContext);
  const { pending, executing, executed } = counter.handoverQueue;

  // handleFetch identity changes with filters/pagination; keep the latest in a
  // ref so the sync effect depends only on the counter values, not on it.
  const handleFetchRef = useRef(handleFetch);
  handleFetchRef.current = handleFetch;

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    handleFetchRef.current();
  }, [pending, executing, executed]);
};
