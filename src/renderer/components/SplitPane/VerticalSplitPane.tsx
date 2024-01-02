import type {
  BaseHTMLAttributes,
  FC,
  ReactElement,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { clsxm } from '$renderer/utils/clsxm';
import { useBoundingRect } from '$renderer/utils/useBoundingRect';

const MIN_HEIGHT = 100;

interface VerticalSplitPaneProps extends BaseHTMLAttributes<HTMLDivElement> {
  children: [ReactElement, ReactElement];
}

export const VerticalSplitPane: FC<VerticalSplitPaneProps> = ({
  children: [top, bottom],
  className,
}) => {
  const splitPaneRef = useRef<HTMLDivElement>(null);
  const [separatorYPosition, setSeparatorYPosition] = useState<
    undefined | number
  >(undefined);
  const [dragging, setDragging] = useState(false);

  const [topRect, updateTopRect, topRef] = useBoundingRect<HTMLDivElement>();

  const topHeight = useMemo(() => {
    if (!topRect) {
      return undefined;
    }
    return topRect.height;
  }, [topRect]);

  const setTopHeight = useCallback(
    (height: number) => {
      if (!topRef.current) {
        return;
      }
      topRef.current.style.height = `${height}px`;
      updateTopRect();
    },
    [topRef, updateTopRect],
  );

  const onMouseDown = (e: ReactMouseEvent) => {
    setSeparatorYPosition(e.clientY);
    setDragging(true);
  };

  const onTouchStart = (e: ReactTouchEvent) => {
    setSeparatorYPosition(e.touches[0].clientY);
    setDragging(true);
  };

  const onMove = useCallback(
    (clientY: number) => {
      if (!dragging || !topHeight || !separatorYPosition) {
        return;
      }

      const newTopHeight = topHeight + (clientY - separatorYPosition);
      setSeparatorYPosition(clientY);

      if (newTopHeight < MIN_HEIGHT) {
        setTopHeight(MIN_HEIGHT);
        return;
      }

      if (splitPaneRef.current) {
        const splitPaneHeight = splitPaneRef.current.clientHeight;

        if (newTopHeight > splitPaneHeight - MIN_HEIGHT) {
          setTopHeight(splitPaneHeight - MIN_HEIGHT);
          return;
        }
      }

      setTopHeight(newTopHeight);
    },
    [dragging, separatorYPosition, topHeight, setTopHeight],
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging) {
        e.preventDefault();
      }
      onMove(e.clientY);
    },
    [dragging, onMove],
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (dragging) {
        e.preventDefault();
      }
      onMove(e.touches[0].clientY);
    },
    [dragging, onMove],
  );

  const onMouseUp = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onTouchMove, onMouseUp]);

  return (
    <div
      className={clsxm('flex w-full flex-col items-start', className)}
      ref={splitPaneRef}
    >
      <div
        className="flex h-[calc(100%-100px)] w-full flex-col items-stretch justify-start *:w-full"
        ref={topRef}
      >
        {top}
      </div>
      <div className="relative h-[1px] w-full bg-neutral-600">
        <div
          className={clsxm(
            'absolute -bottom-[2px] -top-[2px] w-full cursor-row-resize bg-transparent transition-colors duration-150 hover:bg-neutral-600/50',
            {
              'bg-neutral-600/50': dragging,
            },
          )}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        ></div>
      </div>
      <div className="flex w-full flex-auto flex-col items-stretch justify-start *:w-full">
        {bottom}
      </div>
    </div>
  );
};
