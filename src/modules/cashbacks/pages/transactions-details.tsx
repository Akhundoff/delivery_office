import { FC, useMemo } from 'react';
import { Modal } from 'antd';
import { useParams } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { useCloseModal } from '@shared/hooks';
import { CashbackTransactionsTableContext } from '../context';
import { CashbackTransactionsTable } from '../containers';
import { makeCashbackTransactionsFetchUseCase } from '../use-cases/transactions-table-fetch';

export const CashbackTransactionsDetailsPage: FC = () => {
  const [close] = useCloseModal();
  const { cashbackId } = useParams<{ cashbackId: string }>();

  const onFetch = useMemo(() => makeCashbackTransactionsFetchUseCase(cashbackId!), [cashbackId]);

  return (
    <Modal open onCancel={() => close('/cashback')} footer={null} width="100%" closable={false}>
      <NextTableProvider context={CashbackTransactionsTableContext} onFetch={onFetch} name={`cashback-transactions-${cashbackId}`} useCache={false}>
        <CashbackTransactionsTable />
      </NextTableProvider>
    </Modal>
  );
};
