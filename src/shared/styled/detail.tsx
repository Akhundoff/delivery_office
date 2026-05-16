import styled from 'styled-components';
import { Row, Col, Card, Descriptions, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { PageContent } from './page-content';

const GUTTER = [18, 18] as [number, number];

export const DetailPage = styled((props: any) => <PageContent {...props} />)`
    & > .ant-card-body {
        padding: 18px;
    }

    &:not(:last-child) {
        margin-bottom: 12px;
    }
`;

export const DetailRow = styled(Row).attrs({ gutter: GUTTER })``;
export const DetailCol = styled(Col)``;

export const DetailHeader = styled(PageContainer)`
    padding: 0;

    .ant-page-header-heading-left {
        display: flex;
        flex-wrap: wrap;
    }

    .ant-pro-page-container-warp-page-header {
        padding: 0;
    }

    .ant-page-header-heading-tags {
        display: flex;
    }
`;

export const DetailCard = styled(Card).attrs({ size: 'small', type: 'inner' })``;

export const DetailDescriptions = styled(Descriptions).attrs({ bordered: true, column: 1, size: 'small' })`
    margin: -12px -13px -13px -13px;
`;

export const DetailActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    & > *:not(:last-child) {
        margin-right: 18px;
    }
`;

export const DetailActionCol = styled(Space).attrs({ size: 18, wrap: true } as any)``;
