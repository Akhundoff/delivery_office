import React, { useCallback, useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks/use-background-navigate';
import { CashRegisterOperationsTableContext } from '../context';

export const CashRegisterOperationsActionBar = () => {
    const { state, handleFetch, handleReset } = useContext(CashRegisterOperationsTableContext);
    const backgroundNavigate = useBackgroundNavigate();

    const openCreate = useCallback(() => {
        backgroundNavigate('/cash-flow/operations/create', { withBackground: true });
    }, [backgroundNavigate]);

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space>
                    <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>Yenilə</StyledHeaderButton>
                    <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>Sıfırla</StyledHeaderButton>
                    <StyledHeaderButton type='text' disabled>Cəmi: {state.total}</StyledHeaderButton>
                </Space>
                <Space>
                    <StyledHeaderButton type='primary' onClick={openCreate} icon={<Icons.PlusOutlined />}>Yeni kateqoriya</StyledHeaderButton>
                </Space>
            </StyledActionBar>
        </HeadPortal>
    );
};
