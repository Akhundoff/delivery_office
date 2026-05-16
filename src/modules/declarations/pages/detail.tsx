import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { DeclarationDetail } from '../containers/declaration-detail';

export const DeclarationDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) return null;

    return <DeclarationDetail id={id} />;
};
