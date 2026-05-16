import React, { FC, PropsWithChildren } from 'react';

export const StopPropagation: FC<PropsWithChildren> = ({ children }) => {
    return <span onClick={(e) => e.stopPropagation()}>{children}</span>;
};
