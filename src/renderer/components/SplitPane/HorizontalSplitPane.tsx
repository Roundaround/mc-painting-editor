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

const MIN_WIDTH = 380;

interface HorizontalSplitPaneProps extends BaseHTMLAttributes<HTMLDivElement> {
  children: [ReactElement, ReactElement];
}

export const HorizontalSplitPane: FC<HorizontalSplitPaneProps> = ({
  children: [left, right],
  className,
}) => {
  const splitPaneRef = useRef<HTMLDivElement>(null);
  const [separatorXPosition, setSeparatorXPosition] = useState<
    undefined | number
  >(undefined);
  const [dragging, setDragging] = useState(false);

  const [leftRect, updateLeftRect, leftRef] = useBoundingRect<HTMLDivElement>();

  const leftWidth = useMemo(() => {
    if (!leftRect) {
      return undefined;
    }
    return leftRect.width;
  }, [leftRect]);

  const setLeftWidth = useCallback(
    (width: number) => {
      if (!leftRef.current) {
        return;
      }
      leftRef.current.style.width = `${width}px`;
      updateLeftRect();
    },
    [leftRef, updateLeftRect],
  );

  const onMouseDown = (e: ReactMouseEvent) => {
    setSeparatorXPosition(e.clientX);
    setDragging(true);
  };

  const onTouchStart = (e: ReactTouchEvent) => {
    setSeparatorXPosition(e.touches[0].clientX);
    setDragging(true);
  };

  const onMove = useCallback(
    (clientX: number) => {
      if (!dragging || !leftWidth || !separatorXPosition) {
        return;
      }

      const newLeftWidth = leftWidth + clientX - separatorXPosition;
      setSeparatorXPosition(clientX);

      if (newLeftWidth < MIN_WIDTH) {
        setLeftWidth(MIN_WIDTH);
        return;
      }

      if (splitPaneRef.current) {
        const splitPaneWidth = splitPaneRef.current.clientWidth;

        if (newLeftWidth > splitPaneWidth - MIN_WIDTH) {
          setLeftWidth(splitPaneWidth - MIN_WIDTH);
          return;
        }
      }

      setLeftWidth(newLeftWidth);
    },
    [dragging, leftWidth, separatorXPosition, setLeftWidth],
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging) {
        e.preventDefault();
      }
      onMove(e.clientX);
    },
    [dragging, onMove],
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (dragging) {
        e.preventDefault();
      }
      onMove(e.touches[0].clientX);
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
      className={clsxm('flex h-full flex-row items-start', className)}
      ref={splitPaneRef}
    >
      <div
        className="flex h-full w-[380px] flex-col items-stretch justify-start *:h-full"
        ref={leftRef}
      >
        {left}
      </div>
      <div className="relative h-full w-[1px] bg-neutral-600">
        <div
          className={clsxm(
            'absolute -left-[2px] -right-[2px] h-full cursor-col-resize bg-transparent transition-colors duration-150 hover:bg-neutral-600/50',
            {
              'bg-neutral-600/50': dragging,
            },
          )}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        ></div>
      </div>
      <div className="flex h-full flex-auto flex-col items-stretch justify-start *:h-full">
        {right}
      </div>
    </div>
  );
};
