import React, { FC, memo, useMemo } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { green, red } from '@ant-design/colors';

export const NextTableCheckCell: FC<any> = memo<any>(({ cell: { value } }) => {
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

  return (
    <div {...wrapperProps}>
      {!!value ? (
        <CheckOutlined style={{ color: green[5] }} />
      ) : (
        <CloseOutlined style={{ color: red[5] }} />
      )}
    </div>
  );
});
