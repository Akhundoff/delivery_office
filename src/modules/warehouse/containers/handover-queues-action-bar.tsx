import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { HandoverQueuesTableContext } from '../context';

export const HandoverQueuesActionBar = () => {
    const { handleFetch, handleReset } = useContext(HandoverQueuesTableContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isHistory = pathname.includes('/history');

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space>
                    <StyledHeaderButton type={!isHistory ? 'primary' : 'text'} onClick={() => navigate('/warehouse/handover/queues')} icon={<Icons.UnorderedListOutlined />}>
                        Təhvil
                    </StyledHeaderButton>
                    <StyledHeaderButton type={isHistory ? 'primary' : 'text'} onClick={() => navigate('/warehouse/handover/history')} icon={<Icons.HistoryOutlined />}>
                        Tarixçə
                    </StyledHeaderButton>
                    <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
                        Yenilə
                    </StyledHeaderButton>
                    <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>
                        Sıfırla
                    </StyledHeaderButton>
                </Space>
            </StyledActionBar>
        </HeadPortal>
    );
};
