import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { NotificationTemplatesTableContext } from '../context';

export const NotificationTemplatesActionBar = () => {
    const { handleFetch, handleReset } = useContext(NotificationTemplatesTableContext);

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space>
                    <NavLink to='/notifier/templates/create'>
                        <StyledHeaderButton type='text' icon={<Icons.PlusCircleOutlined />}>
                            Yeni
                        </StyledHeaderButton>
                    </NavLink>
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
