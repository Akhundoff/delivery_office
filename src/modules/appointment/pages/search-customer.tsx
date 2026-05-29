import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Button, Col, Input, Row, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { PageContent } from '@shared/styled/page-content';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledActionBar } from '@shared/styled/action-bar';
import { UsersService } from '@modules/users/services';

export const SearchCustomerPage: FC = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [passportSecret, setPassportSecret] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [trackCode, setTrackCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangeUserId = (e: ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value.replace(/[^0-9]/g, ''));
        setPassportSecret('');
        setPhoneNumber('');
        setTrackCode('');
    };

    const handleChangePassportSecret = (e: ChangeEvent<HTMLInputElement>) => {
        setPassportSecret(e.target.value);
        setUserId('');
        setPhoneNumber('');
        setTrackCode('');
    };

    const handleChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
        setUserId('');
        setPassportSecret('');
        setTrackCode('');
    };

    const handleChangeTrackCode = (e: ChangeEvent<HTMLInputElement>) => {
        setTrackCode(e.target.value);
        setUserId('');
        setPassportSecret('');
        setPhoneNumber('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (userId) {
            navigate(`/appointment/${userId}`);
            return;
        }

        setLoading(true);
        try {
            let foundUserId: number | null = null;

            if (trackCode) {
                const result = await UsersService.getUserByTrackCode(trackCode);
                if (result.status === 200) {
                    foundUserId = result.data.id;
                } else {
                    message.error('İstifadəçi tapılmadı.');
                }
            } else if (passportSecret || phoneNumber) {
                const query: Record<string, string> = {};
                if (passportSecret) query.passport_secret = passportSecret;
                if (phoneNumber) query.number = phoneNumber;
                const result = await UsersService.getUsers(query);
                if (result.status === 200 && result.data.data.length > 0) {
                    foundUserId = result.data.data[0].id;
                } else {
                    message.error('İstifadəçi tapılmadı.');
                }
            }

            if (foundUserId) {
                navigate(`/appointment/${foundUserId}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContent>
            <HeadPortal>
                <StyledActionBar $flex />
            </HeadPortal>
            <form onSubmit={handleSubmit}>
                <Row gutter={[12, 12]} style={{ maxWidth: 600 }}>
                    <Col span={24}>
                        <Input
                            value={userId}
                            onChange={handleChangeUserId}
                            placeholder='Müştəri ID'
                            prefix={<Icons.UserOutlined />}
                            size='large'
                        />
                    </Col>
                    <Col span={24}>
                        <Input
                            value={passportSecret}
                            onChange={handleChangePassportSecret}
                            placeholder='FİN Kod'
                            prefix={<Icons.IdcardOutlined />}
                            size='large'
                        />
                    </Col>
                    <Col span={24}>
                        <Input
                            value={phoneNumber}
                            onChange={handleChangePhoneNumber}
                            placeholder='Telefon nömrəsi'
                            prefix={<Icons.PhoneOutlined />}
                            size='large'
                        />
                    </Col>
                    <Col span={24}>
                        <Input
                            value={trackCode}
                            onChange={handleChangeTrackCode}
                            placeholder='İzləmə kodu'
                            prefix={<Icons.BarcodeOutlined />}
                            size='large'
                        />
                    </Col>
                    <Col span={24}>
                        <Button type='primary' htmlType='submit' loading={loading} size='large' icon={<Icons.SearchOutlined />}>
                            Axtar
                        </Button>
                    </Col>
                </Row>
            </form>
        </PageContent>
    );
};
