import React, { useContext } from 'react';
import * as Icons from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { DeclarationsTableContext } from '../context';
import { useDeclarationStatusChange } from '../hooks';

export const DeclarationsActionBar = () => {
    const backgroundNavigate = useBackgroundNavigate();
    const navigate = useNavigate();
    const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(DeclarationsTableContext);
    const selectionCount = Object.values(state.selectedRowIds).filter(Boolean).length;
    const { freelyStatuses, updateSelectedStatus, bulkUpdateStatus } = useDeclarationStatusChange();

    const statusMenuItems = (onSelect: (statusId: number) => void): MenuProps['items'] =>
        freelyStatuses.map((status) => ({ key: status.id, label: status.name, onClick: () => onSelect(status.id) }));

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space>
                    <StyledHeaderButton type='text' onClick={() => backgroundNavigate('/declarations/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
                        Yeni
                    </StyledHeaderButton>
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
                    <StyledHeaderButton type='text' icon={<Icons.DollarOutlined />} onClick={() => navigate('/declarations/handover')}>
                        Toplu təhvil
                    </StyledHeaderButton>
                    {selectionCount > 0 ? (
                        <Dropdown trigger={['click']} disabled={!freelyStatuses.length} menu={{ items: statusMenuItems(updateSelectedStatus) }}>
                            <StyledHeaderButton type='text' icon={<Icons.AppstoreOutlined />}>
                                Status dəyiş
                            </StyledHeaderButton>
                        </Dropdown>
                    ) : (
                        <Dropdown trigger={['click']} disabled={!freelyStatuses.length} menu={{ items: statusMenuItems(bulkUpdateStatus) }}>
                            <StyledHeaderButton type='text' icon={<Icons.AppstoreOutlined />}>
                                Toplu status dəyiş
                            </StyledHeaderButton>
                        </Dropdown>
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
            </StyledActionBar>
        </HeadPortal>
    );
};
