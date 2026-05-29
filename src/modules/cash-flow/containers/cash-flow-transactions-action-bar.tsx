import React, { useCallback, useContext } from 'react';
import { Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks/use-background-navigate';
import { CashFlowTransactionsTableContext } from '../context';
import { CashFlowTransactionsService } from '../services';

export const CashFlowTransactionsActionBar = () => {
    const { state, handleFetch, handleReset } = useContext(CashFlowTransactionsTableContext);
    const backgroundNavigate = useBackgroundNavigate();

    const openCreate = useCallback(() => {
        backgroundNavigate('/cash-flow/transactions/create', { withBackground: true });
    }, [backgroundNavigate]);

    const exportAsExcel = useCallback(async () => {
        message.loading({ key: 'cashflow-export', content: 'Sənəd hazırlanır...', duration: 0 });
        const query: Record<string, any> = {};
        state.filters.forEach((f: any) => { query[f.id] = f.value; });
        const result = await CashFlowTransactionsService.getExcel(query);
        if (result.status === 200) {
            message.success({ key: 'cashflow-export', content: 'Sənəd yüklənir.' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(result.data as Blob);
            a.download = 'cashflow_export.xls';
            a.click();
        } else {
            message.error({ key: 'cashflow-export', content: result.data as string });
        }
    }, [state.filters]);

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space>
                    <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>Yenilə</StyledHeaderButton>
                    <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>Sıfırla</StyledHeaderButton>
                    <StyledHeaderButton type='text' disabled>Cəmi: {state.total}</StyledHeaderButton>
                </Space>
                <Space>
                    <StyledHeaderButton type='text' onClick={exportAsExcel} icon={<Icons.FileExcelOutlined />}>Excel export</StyledHeaderButton>
                    <StyledHeaderButton type='primary' onClick={openCreate} icon={<Icons.PlusOutlined />}>Yeni tranzaksiya</StyledHeaderButton>
                </Space>
            </StyledActionBar>
        </HeadPortal>
    );
};
