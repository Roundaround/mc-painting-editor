import { clsxm } from '$renderer/utils/clsxm';
import { useBoundingRect } from '$renderer/utils/useBoundingRect';
import React, {
  BaseHTMLAttributes,
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './HorizontalSplitPane.module.scss';

const MIN_WIDTH = 380;

interface HorizontalSplitPaneProps extends BaseHTMLAttributes<HTMLDivElement> {
  children: [ReactElement, ReactElement];
}

export const HorizontalSplitPane: FC<HorizontalSplitPaneProps> = (props) => {
  const {
    children: [left, right],
    className: passedClassName,
  } = props;

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

  const onMouseDown = (e: React.MouseEvent) => {
    setSeparatorXPosition(e.clientX);
    setDragging(true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
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

  const wrapperClasses = [styles['wrapper'], passedClassName || '']
    .join(' ')
    .trim();

  return (
    <div className={wrapperClasses} ref={splitPaneRef}>
      <div className={styles['left-pane']} ref={leftRef}>
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
      <div className={styles['right-pane']}>{right}</div>
    </div>
  );
};
