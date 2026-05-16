import React, { FC, useContext, useState } from 'react';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import { MeContext } from '../context/context';
import { MeService } from '../services';
import * as LoginUI from '../components/login';

export const LoginPage: FC = () => {
    const me = useContext(MeContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = async () => {
        me.dispatch({ type: 'SET_AUTH_LOADING', payload: true });

        const loginResult = await MeService.login({ email, password });

        if (loginResult.status !== 200) {
            me.dispatch({ type: 'SET_AUTH_LOADING', payload: false });
            if (loginResult.status !== 422) {
                message.error(loginResult.data as string);
            }
            return;
        }

        const meResult = await MeService.getMe();
        me.dispatch({ type: 'SET_AUTH_LOADING', payload: false });

        if (meResult.status === 200) {
            me.dispatch({ type: 'SET_USER', payload: meResult.data });
            return;
        }

        message.error(meResult.data);
    };

    return (
        <LoginUI.Wrapper id='login-layout' className='one-page-layout'>
            <LoginUI.LoginCard
                id='login-form-card'
                title='Hesabınıza daxil olun'
                actions={[
                    <Typography.Paragraph type='secondary' className='paragraph-no-space' key='company'>
                        {process.env.REACT_APP_COMPANY_NAME} MMC &copy; 2020
                    </Typography.Paragraph>,
                ]}
            >
                <Form layout='vertical' size='large' onFinish={onLogin}>
                    <Form.Item required>
                        <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder='Email' />
                    </Form.Item>
                    <Form.Item required>
                        <Input.Password value={password} onChange={(event) => setPassword(event.target.value)} placeholder='Şifrə' />
                    </Form.Item>
                    <Form.Item>
                        <Checkbox>Yadda saxla</Checkbox>
                    </Form.Item>
                    <Button type='primary' htmlType='submit' loading={me.state.auth.loading} block>
                        Daxil ol
                    </Button>
                </Form>
            </LoginUI.LoginCard>
        </LoginUI.Wrapper>
    );
};
