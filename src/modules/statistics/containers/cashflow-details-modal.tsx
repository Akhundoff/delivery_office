import { Dispatch, FC, useMemo } from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { NextTable } from '@shared/modules/next-table/containers';
import {
    nextTableFetchDataFailedAction,
    nextTableFetchDataStartedAction,
    nextTableFetchDataSucceedAction,
} from '@shared/modules/next-table/context/actions';
import { NextTableActions } from '@shared/modules/next-table/context/action-types';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { useCloseModal } from '@shared/hooks';
import { CashFlowTransactionsTableContext } from '@modules/cash-flow/context';
import { useCashFlowTransactionsTableColumns } from '@modules/cash-flow/hooks';
import { CashFlowTransactionsService } from '@modules/cash-flow/services';
import { ICashFlowTransaction } from '@modules/cash-flow/interfaces';

const CashFlowDetailTable: FC = () => {
    const columns = useCashFlowTransactionsTableColumns() as any;
    return <NextTable context={CashFlowTransactionsTableContext} columns={columns} />;
};

export const CashFlowDetailsModal: FC = () => {
    const [close] = useCloseModal();
    const { startDate, endDate, operationType, paymentType, cashboxId, cashCategoryId, cashCategoryIdParent } = (useLocation().state || {}) as any;

    const onFetch = useMemo(
        () => (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
            dispatch(nextTableFetchDataStartedAction());
            const result = await CashFlowTransactionsService.getList({
                operation_date: `${startDate},${endDate}`,
                operation: operationType,
                payment_type: paymentType,
                cashbox_id: cashboxId,
                cash_category_id: cashCategoryId,
                cash_category_id_parent: cashCategoryIdParent,
                ...tableQueryMaker(params),
            });
            if (result.status === 200) {
                dispatch(nextTableFetchDataSucceedAction({ data: result.data.data as ICashFlowTransaction[], total: result.data.total }));
            } else {
                dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
            }
        },
        [startDate, endDate, operationType, paymentType, cashboxId, cashCategoryId, cashCategoryIdParent],
    );

    return (
        <Modal open onCancel={() => close('/statistics/cashflow-transactions')} footer={null} width='100%' closable={false}>
            <NextTableProvider context={CashFlowTransactionsTableContext} onFetch={onFetch} name='stat-cashflow-details' useCache={false}>
                <CashFlowDetailTable />
            </NextTableProvider>
        </Modal>
    );
};
