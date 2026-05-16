import { useCallback, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { message, Modal, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { SmsNotificationsQueueTableContext } from '../context';
import { SmsNotificationsQueueService } from '../services';

export const SmsNotificationsQueueActionBar = () => {
    const { handleFetch, handleReset } = useContext(SmsNotificationsQueueTableContext);

    const sendAll = useCallback(() => {
        Modal.confirm({
            title: 'Diqqət',
            content: 'Növbədəki mesajları göndərməyə əminsinizmi?',
            onOk: async () => {
                const result = await SmsNotificationsQueueService.sendAll();
                if (result.status === 200) {
                    message.success('Növbədəki mesajlar müvəffəqiyyətlə göndərildi.');
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
                    <StyledHeaderButton type='text' icon={<Icons.FieldTimeOutlined />} onClick={sendAll}>
                        Növbədəkiləri göndər
                    </StyledHeaderButton>
                </Space>
            </StyledActionBar>
        </HeadPortal>
    );
};
