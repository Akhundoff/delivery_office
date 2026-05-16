import React, { FC, memo, useMemo } from 'react';
import { LoadingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { green, red } from '@ant-design/colors';

export const Check: FC<{ checked?: boolean; loading?: boolean }> = ({ checked, loading }) => {
    const wrapperProps = useMemo(
        () => ({
            style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                flex: 1,
            },
        }),
        [],
    );

    const checkProps = useMemo(
        () => ({
            style: { color: green[5] },
        }),
        [],
    );

    const closeProps = useMemo(
        () => ({
            style: { color: red[5] },
        }),
        [],
    );

    return (
        <div {...wrapperProps}>
            {loading && <LoadingOutlined />}
            {!loading && (!!checked ? <CheckOutlined {...checkProps} /> : <CloseOutlined {...closeProps} />)}
        </div>
    );
};

export const CheckCell: FC<any> = memo<any>(({ cell: { value } }) => {
    return <Check checked={value} />;
});
