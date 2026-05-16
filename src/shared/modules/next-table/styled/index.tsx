import styled, { css } from 'styled-components';
import { Pagination as BasePagination } from 'antd';
import { lighten } from 'polished';

const dangerColor = '#ff4d4f';

const Result = styled.div<{ $visible?: boolean }>`
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    z-index: 2;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(-24px)')};
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;
`;

const Td = styled.div``;
const Th = styled.div``;

const Tr = styled.div<{ $selected?: boolean; $danger?: boolean }>`
    ${({ $selected, $danger }) => {
        if ($selected) return css`background-color: #e6f7ff; &:hover { background-color: #d2ecff; }`;
        if ($danger) return css`background-color: ${lighten(0.33, dangerColor)}; &:hover { background-color: ${lighten(0.32, dangerColor)}; }`;
        return css`background-color: #ffffff; &:hover { background-color: #e6f7ff; }`;
    }}
`;

const Thead = styled.div`
    ${Th} {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 8px;
        color: rgba(0, 0, 0, 0.85);
        background-color: #fafafa;
        font-weight: 500;
        border-bottom: 1px solid #f0f0f0;
        border-right: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background-color 0.3s;
        &:hover { background-color: #f0f0f0; }

        .next-table-sorter {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            margin-left: 4px;
            color: rgba(0, 0, 0, 0.25);
            font-size: 0;
            vertical-align: middle;

            .ant-table-column-sorter-inner {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
            }

            .ant-table-column-sorter-up,
            .ant-table-column-sorter-down {
                font-size: 10px;
                line-height: 0.9em;
                transition: color 0.3s;
                color: rgba(0, 0, 0, 0.25);

                &.active {
                    color: #52c41a;
                }
            }
        }
    }
`;

const TBody = styled.div`
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    ${Td} {
        display: flex;
        align-items: center;
        padding: 8px;
        color: rgba(0, 0, 0, 0.85);
        border-right: 1px solid #f0f0f0;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
    }
`;

const Filter = styled.div`width: 100%; text-align: left;`;

const Table = styled.div`
    border: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    flex: 1;
    max-height: 100%;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
`;

const Outer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    position: relative;
`;

const Pagination = styled(BasePagination)`
    padding: 8px;
    background-color: #fafafa;
    border: 1px solid #f0f0f0;
    border-top: none;
`;

export const StyledNextTable = { Result, Tr, Td, Th, Thead, TBody, Filter, Table, Wrapper, Outer, Pagination };
