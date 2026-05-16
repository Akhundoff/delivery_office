import { useCallback, useContext, useMemo } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { PostDeclarationsTableContext } from '../context';

export const PostDeclarationsActionBar = () => {
    const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection, handleChangeFilterById } = useContext(PostDeclarationsTableContext);
    const selectionCount = Object.values(state.selectedRowIds).filter(Boolean).length;

    const isRead = useMemo(() => !!state.filters.find((f: any) => f.id === 'is_new')?.value, [state.filters]);

    const toggleRead = useCallback(() => {
        handleChangeFilterById('is_new', !isRead ? '1' : undefined);
    }, [isRead, handleChangeFilterById]);

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space>
                    {!selectionCount ? (
                        <StyledHeaderButton type='text' onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
                            Hamısını seç
                        </StyledHeaderButton>
                    ) : (
                        <StyledActionBar.Selection>
                            <Icons.CloseCircleTwoTone twoToneColor='#ff4d4f' onClick={handleResetSelection} style={{ cursor: 'pointer', fontSize: 16 }} role='icon' />
                            <span>{selectionCount} seçilib</span>
                        </StyledActionBar.Selection>
                    )}
                    <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
                        Yenilə
                    </StyledHeaderButton>
                    <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>
                        Sıfırla
                    </StyledHeaderButton>
                    <StyledHeaderButton type='text' disabled={true}>
                        Cəmi: {state.total}
                    </StyledHeaderButton>
                </Space>
                <Space>
                    <StyledHeaderButton type='text' onClick={toggleRead} icon={<Icons.ReadOutlined />}>
                        {isRead ? 'Oxunmuş' : 'Oxunmamış'}
                    </StyledHeaderButton>
                </Space>
            </StyledActionBar>
        </HeadPortal>
    );
};
