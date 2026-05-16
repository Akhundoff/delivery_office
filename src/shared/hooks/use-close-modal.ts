import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useBackgroundNavigate } from './use-background-navigate';

export const useCloseModal = () => {
    const location = useLocation();
    const navigate = useBackgroundNavigate();

    const close = useCallback(
        (fallback: string, query: Record<string, string> = {}) => {
            const appendQuery = (to: any): any => {
                if (!Object.keys(query).length) return to;
                const qs = new URLSearchParams(query).toString();
                if (typeof to === 'string') return `${to}${to.includes('?') ? '&' : '?'}${qs}`;
                return { ...to, search: qs ? `?${qs}` : (to.search || '') };
            };
            if (location.state?.modal) {
                navigate(appendQuery(location.state.modal));
            } else if (location.state?.background) {
                navigate(appendQuery(location.state.background));
            } else {
                navigate(appendQuery(fallback));
            }
        },
        [location.state?.background, location.state?.modal, navigate],
    );

    const nextLocation = location?.state?.background || location.state?.modal;

    return [close, nextLocation] as [typeof close, typeof location];
};
