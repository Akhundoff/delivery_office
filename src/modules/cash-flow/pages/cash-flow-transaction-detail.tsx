import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { CashFlowTransactionDetail } from '../containers/cash-flow-transaction-detail';

export const CashFlowTransactionDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return <CashFlowTransactionDetail id={id!} />;
};
