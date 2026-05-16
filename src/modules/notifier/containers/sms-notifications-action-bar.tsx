import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { SmsNotificationsTableContext } from '../context';

export const SmsNotificationsActionBar = () => {
    const { handleFetch, handleReset } = useContext(SmsNotificationsTableContext);

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space>
                    <NavLink to='/notifier/sms/bulk/send'>
                        <StyledHeaderButton type='text' icon={<Icons.PlusCircleOutlined />}>
                            Toplu sms göndər
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
                    <NavLink to='/notifier/queue-sms'>
                        <StyledHeaderButton type='text' icon={<Icons.FieldTimeOutlined />}>
                            Növbədəkilər
                        </StyledHeaderButton>
                    </NavLink>
                </Space>
            </StyledActionBar>
        </HeadPortal>
    );
};
