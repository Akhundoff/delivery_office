import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

import { UserDetails } from '../containers/user-details';

export const UserDetailsPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) return null;

    return <UserDetails id={id} />;
};
