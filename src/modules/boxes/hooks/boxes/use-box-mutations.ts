import { useCallback, useState } from 'react';
import { message } from 'antd';
import { BoxesService } from '../../services';

export const useSelectBox = () => {
  const [loading, setLoading] = useState(false);
  const execute = useCallback(async (containerId: string | number) => {
    setLoading(true);
    const result = await BoxesService.selectBox(containerId);
    setLoading(false);
    if (result.status !== 200) message.error(result.data as string);
    return result;
  }, []);
  return { execute, loading };
};

export const useCloseBox = () => {
  const [loading, setLoading] = useState(false);
  const execute = useCallback(async (trackCodes: string[], containerId?: string | number) => {
    setLoading(true);
    const result = await BoxesService.closeBox(trackCodes, containerId);
    setLoading(false);
    return result;
  }, []);
  return { execute, loading };
};

export const useTransferBox = () => {
  const [loading, setLoading] = useState(false);
  const execute = useCallback(async (trackCodes: string[]) => {
    setLoading(true);
    const result = await BoxesService.transferBox(trackCodes);
    setLoading(false);
    return result;
  }, []);
  return { execute, loading };
};
