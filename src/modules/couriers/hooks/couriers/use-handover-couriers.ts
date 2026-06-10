import { useState } from 'react';
import { message } from 'antd';
import { useQuery } from 'react-query';
import { CouriersService } from '../../services';

export const useHandoverCouriers = (id: string) => {
  const [submitting, setSubmitting] = useState(false);

  const detailsQuery = useQuery(['courier', id, 'payment-details'], () => CouriersService.getPaymentDetails([id]), { enabled: !!id });

  const details = detailsQuery.data?.status === 200 ? detailsQuery.data.data : undefined;

  const onSubmit = async (amount: string) => {
    if (details && parseFloat(amount) < details.minimalPayment.azn) {
      message.warning(`Minimal ödəniş məbləği ${details.minimalPayment.azn.toFixed(2)} AZN olmalıdır`);
      return;
    }
    setSubmitting(true);
    const result = await CouriersService.handover([id], amount);
    setSubmitting(false);
    if (result.status === 200) {
      message.success('Bağlamalar təhvil verildi');
    } else {
      message.error(result.data as string);
    }
  };

  return { details, detailsLoading: detailsQuery.isLoading, submitting, onSubmit };
};
