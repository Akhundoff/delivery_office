import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Descriptions, Modal, Space, Spin, Tooltip, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { INotificationTemplate } from '../interfaces';
import { NotificationTemplatesService } from '../services';

export const NotificationTemplateDetails: FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [tpl, setTpl] = useState<INotificationTemplate | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        NotificationTemplatesService.getById(id).then((r) => {
            if (r.status === 200) setTpl(r.data);
            setIsLoading(false);
        });
    }, [id]);

    const onClose = useCallback(() => navigate(-1), [navigate]);

    const openEdit = useCallback(() => {
        navigate(`/notifier/templates/${id}/update`);
    }, [id, navigate]);

    const remove = useCallback(() => {
        Modal.confirm({
            title: 'Diqqət',
            content: 'Şablonu silməyə əminsinizmi?',
            onOk: async () => {
                const result = await NotificationTemplatesService.remove(Number(id));
                if (result.status === 200) {
                    message.success('Şablon silindi.');
                    navigate('/notifier/templates');
                } else {
                    message.error('Xəta baş verdi.');
                }
            },
        });
    }, [id, navigate]);

    const extra = (
        <Space>
            <Tooltip title='Düzəliş et'>
                <Button type='link' icon={<Icons.EditOutlined />} onClick={openEdit} />
            </Tooltip>
            <Tooltip title='Sil'>
                <Button type='link' danger icon={<Icons.DeleteOutlined />} onClick={remove} />
            </Tooltip>
        </Space>
    );

    return (
        <Modal open width={900} onCancel={onClose} footer={null} title={tpl ? tpl.name : 'Şablon'}>
            {isLoading && (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <Spin />
                </div>
            )}
            {tpl && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>{extra}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Card size='small' title='Ümumi'>
                            <Descriptions column={2} size='small' bordered>
                                <Descriptions.Item label='Kod'>{tpl.id}</Descriptions.Item>
                                <Descriptions.Item label='Ad'>{tpl.name}</Descriptions.Item>
                                <Descriptions.Item label='Başlıq'>{tpl.title}</Descriptions.Item>
                                <Descriptions.Item label='Vəziyyət'>{tpl.isActive ? 'İşləkdir' : 'İşlək deyil'}</Descriptions.Item>
                                <Descriptions.Item label='Yaradılıb'>{tpl.createdAt}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                        <Card size='small' title='Ayarlar'>
                            <Descriptions column={2} size='small' bordered>
                                <Descriptions.Item label='Model'>{tpl.model.name}</Descriptions.Item>
                                <Descriptions.Item label='Status'>{tpl.status?.name || 'Daxil edilməyib'}</Descriptions.Item>
                                <Descriptions.Item label='Tip'>{tpl.type.name}</Descriptions.Item>
                                <Descriptions.Item label='Gecikmə'>{tpl.delay} san.</Descriptions.Item>
                                {tpl.htmlTemplateId && <Descriptions.Item label='HTML template ID'>{tpl.htmlTemplateId}</Descriptions.Item>}
                            </Descriptions>
                        </Card>
                        <Card size='small' title='Məzmun'>
                            <div dangerouslySetInnerHTML={{ __html: tpl.body }} />
                        </Card>
                    </div>
                </>
            )}
        </Modal>
    );
};
