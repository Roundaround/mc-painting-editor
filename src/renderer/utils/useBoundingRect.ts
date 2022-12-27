import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

export function useBoundingRect<T extends HTMLElement>(): [
  DOMRect | false,
  () => void,
  RefObject<T>
] {
  const ref = useRef<T>(null);
  const [boundingRect, setBoundingRect] = useState(false as DOMRect | false);

  const updateBoundingRect = useCallback(() => {
    setBoundingRect(
      ref && ref.current ? ref.current.getBoundingClientRect() : false
    );
  }, [ref]);

  const useEffectInEvent = (event: string, useCapture = false) => {
    useEffect(() => {
      updateBoundingRect();
      window.addEventListener(event, updateBoundingRect, useCapture);
      return () =>
        window.removeEventListener(event, updateBoundingRect, useCapture);
    }, [event, useCapture]);
  };

  useEffectInEvent('resize');
  useEffectInEvent('scroll', true);

  return [boundingRect, updateBoundingRect, ref];
}
