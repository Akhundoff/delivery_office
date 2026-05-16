import React, { FC, ReactNode } from 'react';
import { StyledProgress } from '../styled';
import { Progress } from 'antd';

interface ProgressProps {
  title: string;
  subTitle?: string;
  bottomText?: string;
  progress: number;
  value: ReactNode;
  bottomValue?: number;
}

export const ProgressUI: FC<ProgressProps> = ({ title, subTitle, value, progress, bottomText, bottomValue }) => {
  return (
    <StyledProgress.Wrapper>
      <StyledProgress.Text>
        <div>
          <StyledProgress.Paragraph strong={true}>{title}</StyledProgress.Paragraph>
          <StyledProgress.Paragraph>{subTitle}</StyledProgress.Paragraph>
        </div>
        <div>
          <StyledProgress.Title>{value}</StyledProgress.Title>
        </div>
      </StyledProgress.Text>
      <Progress showInfo={false} percent={progress} />
      <StyledProgress.Text $last={true}>
        <div>
          <StyledProgress.Paragraph>{bottomText}</StyledProgress.Paragraph>
        </div>
        <div>
          <StyledProgress.Paragraph>{bottomValue}</StyledProgress.Paragraph>
        </div>
      </StyledProgress.Text>
    </StyledProgress.Wrapper>
  );
};
