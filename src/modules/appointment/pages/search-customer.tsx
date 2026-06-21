import { ChangeEvent, FC, FormEvent, useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, Col, Input, Row, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { PageContent } from '@shared/styled/page-content';
import { UsersService } from '@modules/users/services';
import { defaultFilterEnabled } from '../utils';

export const SearchCustomerPage: FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [passportSecret, setPassportSecret] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trackCode, setTrackCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [noFilter, setNoFilter] = useState<boolean>(defaultFilterEnabled());

  const handleChangeUserId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value.replace(/[^0-9]/g, ''));
    setPassportSecret('');
    setPhoneNumber('');
    setTrackCode('');
  }, []);

  const handleChangePassportSecret = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassportSecret(e.target.value);
    setUserId('');
    setPhoneNumber('');
    setTrackCode('');
  }, []);

  const handleChangePhoneNumber = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    setUserId('');
    setPassportSecret('');
    setTrackCode('');
  }, []);

  const handleChangeTrackCode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTrackCode(e.target.value);
    setUserId('');
    setPassportSecret('');
    setPhoneNumber('');
  }, []);

  const onChangeFilter = useCallback((e: CheckboxChangeEvent) => {
    setNoFilter(e.target.checked);
  }, []);

  useEffect(() => {
    localStorage.setItem('no_filter_appointment', noFilter.toString());
  }, [noFilter]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
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
            message.warning('İzləmə koduna uyğun müştəri tapılmadı.');
          }
        } else if (passportSecret || phoneNumber) {
          const query: Record<string, string> = {};
          if (passportSecret) query.passport_secret = passportSecret;
          if (phoneNumber) query.number = phoneNumber;
          const result = await UsersService.getUsers(query);
          if (result.status === 200 && result.data.data.length > 0) {
            foundUserId = result.data.data[0].id;
          } else {
            message.warning('Müştəri tapılmadı.');
          }
        } else {
          message.warning('Müştəri və ya izləmə kodu daxil edin.');
        }

        if (foundUserId) navigate(`/appointment/${foundUserId}`);
      } finally {
        setLoading(false);
      }
    },
    [userId, trackCode, passportSecret, phoneNumber, navigate],
  );

  const buttonDisabled = !userId && !trackCode && !passportSecret && !phoneNumber;

  return (
    <PageContent style={{ marginBottom: 12 }}>
      <form onSubmit={handleSubmit}>
        <Row gutter={12}>
          <Col span={24} md={4}>
            <Input value={userId} onChange={handleChangeUserId} placeholder="Müştəri kodu" size="large" allowClear />
          </Col>
          <Col span={24} md={4}>
            <Input value={passportSecret} maxLength={10} onChange={handleChangePassportSecret} placeholder="FİN kod" size="large" allowClear />
          </Col>
          <Col span={24} md={4}>
            <Input value={phoneNumber} minLength={10} maxLength={12} onChange={handleChangePhoneNumber} placeholder="Mobil no: 99450" size="large" allowClear />
          </Col>
          <Col span={24} md={6}>
            <Input value={trackCode} onChange={handleChangeTrackCode} placeholder="İzləmə kodunu daxil edin..." size="large" allowClear />
          </Col>
          <Col>
            <Button loading={loading} htmlType="submit" disabled={buttonDisabled} size="large" type="primary" icon={<Icons.SearchOutlined />}>
              Axtar
            </Button>
            <Checkbox style={{ marginLeft: 10 }} checked={noFilter} onChange={onChangeFilter}>
              Bütün
            </Checkbox>
          </Col>
        </Row>
      </form>
    </PageContent>
  );
};
