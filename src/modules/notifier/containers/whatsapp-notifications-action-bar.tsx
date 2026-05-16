import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { WhatsappNotificationsTableContext } from '../context';

export const WhatsappNotificationsActionBar = () => {
    const { handleFetch, handleReset } = useContext(WhatsappNotificationsTableContext);

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space>
                    <NavLink to='/notifier/whatsapp/bulk/send'>
                        <StyledHeaderButton type='text' icon={<Icons.WhatsAppOutlined />}>
                            Toplu whatsapp göndər
                        </StyledHeaderButton>
                    </NavLink>
                    <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
                        Yenilə
                    </StyledHeaderButton>
                    <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>
                        Sıfırla
                    </StyledHeaderButton>
                </Space>
                <Space>
                    <NavLink to='/notifier/queue-whatsapp'>
                        <StyledHeaderButton type='text' icon={<Icons.FieldTimeOutlined />}>
                            Növbədəkilər
                        </StyledHeaderButton>
                    </NavLink>
                </Space>
            </StyledActionBar>
        </HeadPortal>
    );
};
