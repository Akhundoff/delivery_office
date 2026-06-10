import { useState } from 'react';
import { message } from 'antd';
import { CouriersService } from '../../services';

export const useAssignDeliverer = (id: string, onSuccess: () => void) => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (delivererId: string) => {
    setSubmitting(true);
    const result = await CouriersService.assignDeliverer([id], delivererId);
    setSubmitting(false);
    if (result.status === 200) {
      message.success('Kuryer təhkim edildi');
      onSuccess();
    } else {
      message.error(result.data as string);
    }
  };

  return { submitting, onSubmit };
};
