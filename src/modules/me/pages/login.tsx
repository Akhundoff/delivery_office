import React, { FC } from 'react';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { useLoginForm } from '../hooks';
import * as LoginUI from '../components/login';

export const LoginPage: FC = () => {
  const { formData, fieldErrors, loading, onChange, onSubmit } = useLoginForm();

  return (
    <LoginUI.Wrapper id="login-layout" className="one-page-layout">
      <LoginUI.LoginCard
        id="login-form-card"
        title="Hesabınıza daxil olun"
        actions={[
          <Typography.Paragraph type="secondary" className="paragraph-no-space" key="company">
            {process.env.REACT_APP_COMPANY_NAME} MMC &copy; 2020
          </Typography.Paragraph>,
        ]}
      >
        <Form layout="vertical" size="large" onFinish={onSubmit}>
          <Form.Item required validateStatus={fieldErrors.email ? 'error' : undefined} help={fieldErrors.email?.join(', ')}>
            <Input value={formData.email} onChange={(event) => onChange('email', event.target.value)} placeholder="Email" />
          </Form.Item>
          <Form.Item required validateStatus={fieldErrors.password ? 'error' : undefined} help={fieldErrors.password?.join(', ')}>
            <Input.Password value={formData.password} onChange={(event) => onChange('password', event.target.value)} placeholder="Şifrə" />
          </Form.Item>
          <Form.Item>
            <Checkbox checked={formData.rememberMe} onChange={(event) => onChange('rememberMe', event.target.checked)}>
              Yadda saxla
            </Checkbox>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Daxil ol
          </Button>
        </Form>
      </LoginUI.LoginCard>
    </LoginUI.Wrapper>
  );
};
