import React, { memo } from 'react';
import { StyledNextTable } from '../styled';

type NextTablePaginationProps = {
    total: number;
    pageIndex: number;
    pageSize: number;
    pageOptions: string[];
    gotoPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
};

export const NextTablePagination = memo<NextTablePaginationProps>(({ pageIndex, total, pageSize, pageOptions, setPageSize, gotoPage }) => {
    return (
        <StyledNextTable.Pagination
            current={pageIndex + 1}
            className='next-table-pagination'
            total={total}
            pageSize={pageSize}
            pageSizeOptions={pageOptions}
            onChange={(page) => gotoPage(page - 1)}
            onShowSizeChange={(_, size) => setPageSize(size)}
            showSizeChanger
            showQuickJumper
            showLessItems
            responsive
        />
    );
});
