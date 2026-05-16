import { useCallback } from 'react';
import { useLocation, useNavigate, NavigateOptions, To } from 'react-router-dom';

export const useBackgroundNavigate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = useCallback(
        (to: To | number, options?: NavigateOptions & { withBackground?: boolean }) => {
            if (typeof to === 'number') {
                navigate(to);
                return;
            }

            const { withBackground, state, ...rest } = options || {};

            const nextState = withBackground ? { background: location, ...state } : state;

            navigate(to, { ...rest, state: nextState });
        },
        [navigate, location],
    );

    return handleNavigation;
};
