import { useCallback, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { message, Modal, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { EmailNotificationsQueueTableContext } from '../context';
import { EmailNotificationsQueueService } from '../services';

export const EmailNotificationsQueueActionBar = () => {
    const { handleFetch, handleReset } = useContext(EmailNotificationsQueueTableContext);

    const sendAll = useCallback(() => {
        Modal.confirm({
            title: 'Diqqət',
            content: 'Növbədəki emailləri göndərməyə əminsinizmi?',
            onOk: async () => {
                const result = await EmailNotificationsQueueService.sendAll();
                if (result.status === 200) {
                    message.success('Növbədəki emaillər müvəffəqiyyətlə göndərildi.');
                    handleFetch();
                } else {
                    message.error('Xəta baş verdi.');
                }
            },
        });
    }, [handleFetch]);

    return (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Space>
                    <NavLink to='/notifier/email/bulk/send'>
                        <StyledHeaderButton type='text' icon={<Icons.PlusCircleOutlined />}>
                            Toplu email göndər
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
                    <StyledHeaderButton type='text' icon={<Icons.FieldTimeOutlined />} onClick={sendAll}>
                        Növbədəkiləri göndər
                    </StyledHeaderButton>
                </Space>
            </StyledActionBar>
        </HeadPortal>
    );
};
