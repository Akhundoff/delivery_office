import styled from 'styled-components';
import { Card, Layout } from 'antd';
import landscapeImage from '../../../assets/images/landscape.jpg';

export const Wrapper = styled(Layout)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-image: url(${landscapeImage});
  background-size: cover;
  background-position: center;
`;

export const LoginCard = styled(Card)`
  width: 100%;
  max-width: 384px;
  border-radius: 24px;
  background: none;
  box-shadow: 38px 38px 77px rgba(0, 0, 0, 0.15), -38px -38px 77px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .ant-card-body,
  .ant-card-head {
    background: #ffffff;
  }

  .ant-card-actions {
    background: none;
    backdrop-filter: blur(16px);
    background: rgba(255, 255, 255, 0.3);
  }

  .ant-card-head-title {
    text-align: center;
    text-transform: uppercase;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.85);
  }

  .ant-btn-primary {
    background-color: #1da57a;
    border-color: #1da57a;
    border-radius: 2px;
  }

  .ant-btn-primary:hover,
  .ant-btn-primary:focus {
    background-color: #3db389;
    border-color: #3db389;
  }

  .ant-btn-primary:active {
    background-color: #389e0d;
    border-color: #389e0d;
  }
`;
