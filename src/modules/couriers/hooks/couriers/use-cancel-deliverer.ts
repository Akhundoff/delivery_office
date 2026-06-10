import { useState } from 'react';
import { message } from 'antd';
import { CouriersService } from '../../services';

export const useCancelDeliverer = (ids: number[], onSuccess: () => void) => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (reasonId: string) => {
    setSubmitting(true);
    const result = await CouriersService.cancelDeliverer(ids, reasonId);
    setSubmitting(false);
    if (result.status === 200) {
      message.success('Kuryer ləğv edildi');
      onSuccess();
    } else {
      message.error(result.data as string);
    }
  };

  return { submitting, onSubmit };
};
