import { FC, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Descriptions, Modal, Space, Spin, Tooltip, Typography, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { TicketTemplatesService } from '../services';
import { useQuery } from 'react-query';

export const TicketTemplateDetails: FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useQuery(
        ['ticket-templates', 'item', id],
        () => TicketTemplatesService.getById(id!),
        { enabled: !!id },
    );

    const onClose = useCallback(() => navigate(-1), [navigate]);

    const openEdit = useCallback(() => {
        navigate(`/ticket-templates/${id}/update`);
    }, [id, navigate]);

    const remove = useCallback(() => {
        Modal.confirm({
            title: 'Diqqət',
            content: 'Müraciət şablonunu silməyə əminsinizmi?',
            onOk: async () => {
                const result = await TicketTemplatesService.remove(Number(id));
                if (result.status === 200) {
                    message.success('Şablon silindi.');
                    navigate('/ticket-templates');
                } else {
                    message.error('Xəta baş verdi.');
                }
            },
        });
    }, [id, navigate]);

    const tpl = data?.status === 200 ? data.data : null;

    return (
        <Modal open width={768} onCancel={onClose} footer={null} title={tpl ? `#${tpl.id} nömrəli şablon` : 'Şablon'}>
            {isLoading && (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <Spin />
                </div>
            )}
            {tpl && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                        <Space>
                            <Tooltip title='Düzəliş et'>
                                <Button type='link' icon={<Icons.EditOutlined />} onClick={openEdit} />
                            </Tooltip>
                            <Tooltip title='Sil'>
                                <Button type='link' danger icon={<Icons.DeleteOutlined />} onClick={remove} />
                            </Tooltip>
                        </Space>
                    </div>
                    <Card size='small' title='Ümumi' style={{ marginBottom: 16 }} bodyStyle={{ padding: 0 }}>
                        <Descriptions column={1} size='small' bordered>
                            <Descriptions.Item label='Kod'>{tpl.id}</Descriptions.Item>
                            <Descriptions.Item label='Başlıq'>{tpl.name}</Descriptions.Item>
                            <Descriptions.Item label='Yaradılma tarixi'>{tpl.createdAt}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                    <Card size='small' title='Məzmun'>
                        <Typography.Paragraph>{tpl.body}</Typography.Paragraph>
                    </Card>
                </>
            )}
        </Modal>
    );
};
