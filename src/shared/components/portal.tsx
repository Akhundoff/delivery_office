import { createPortal } from 'react-dom';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';

export const Portal: FC<PropsWithChildren> = ({ children }) => {
  const containerElementRef = useRef(document.createElement('div'));

  useEffect(() => {
    const containerElement = containerElementRef.current;
    let rootNode = document.querySelector('#portal-root');

    if (!rootNode) {
      rootNode = document.createElement('div');
      rootNode.setAttribute('id', 'portal-root');
      document.body.appendChild(rootNode);
    }

    rootNode.appendChild(containerElement);

    return () => {
      rootNode?.removeChild(containerElement);
    };
  }, []);

  return createPortal(children, containerElementRef.current);
};
