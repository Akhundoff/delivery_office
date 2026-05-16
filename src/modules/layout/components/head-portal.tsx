import { createPortal } from 'react-dom';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';

export const HeadPortal: FC<PropsWithChildren> = ({ children }) => {
    const containerElementRef = useRef(document.createElement('div'));

    useEffect(() => {
        const containerElement = containerElementRef.current;
        const rootNode = document.querySelector('#app-header-portal-area');
        if (rootNode) {
            rootNode.appendChild(containerElement);
        }
        return () => {
            rootNode?.removeChild(containerElement);
        };
    }, []);

    return createPortal(children, containerElementRef.current);
};
