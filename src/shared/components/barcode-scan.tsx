import { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const beam = keyframes`
  50% { opacity: 0.7; }
`;

const scanningAnimation = keyframes`
  0%   { transform: translateY(10px); }
  50%  { transform: translateY(-60px); }
  100% { transform: translateY(10px); }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Inner = styled.div`
  position: relative;
  width: 200px;
`;

const Lines = styled.div`
  display: flex;
  justify-content: space-between;
  height: 80px;
`;

const Bar = styled.div<{ $w: number }>`
  width: ${({ $w }) => $w}px;
  background-color: #000;
`;

const Values = styled.div`
  text-align: center;
  margin-top: -4px;
`;

const Scanner = styled.div`
  animation: ${scanningAnimation} 2s infinite;
`;

const Laser = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  height: 1px;
  width: calc(100% + 50px);
  background-color: red;
  transform: translateX(-50%);
  box-shadow: 0 0 4px red;
  animation: ${beam} 0.1s infinite;
`;

const BAR_WIDTHS = [2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 4, 2, 1, 3, 5, 2, 4, 1, 3, 2, 4];

export const BarcodeScan: FC<{ barcode?: string }> = ({ barcode = 'xxxx xxxx xxxx' }) => (
  <Container>
    <Inner>
      <Lines>
        {BAR_WIDTHS.map((w, i) => (
          <Bar key={i} $w={w} />
        ))}
      </Lines>
      <Values>{barcode}</Values>
      <Scanner>
        <Laser />
      </Scanner>
    </Inner>
  </Container>
);
