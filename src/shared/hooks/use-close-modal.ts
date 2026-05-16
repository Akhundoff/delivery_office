import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useBackgroundNavigate } from './use-background-navigate';

export const useCloseModal = () => {
    const location = useLocation();
    const navigate = useBackgroundNavigate();

    const close = useCallback(
        (fallback: string) => {
            if (location.state?.modal) {
                navigate(location.state.modal);
            } else if (location.state?.background) {
                navigate(location.state.background);
            } else {
                navigate(fallback);
            }
        },
        [location.state?.background, location.state?.modal, navigate],
    );

    const nextLocation = location?.state?.background || location.state?.modal;

    return [close, nextLocation] as [typeof close, typeof location];
};
