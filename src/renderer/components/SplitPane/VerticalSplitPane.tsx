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
import styles from './VerticalSplitPane.module.scss';

const MIN_HEIGHT = 100;

interface VerticalSplitPaneProps extends BaseHTMLAttributes<HTMLDivElement> {
  children: [ReactElement, ReactElement];
}

export const VerticalSplitPane: FC<VerticalSplitPaneProps> = (props) => {
  const {
    children: [top, bottom],
    className: passedClassName,
  } = props;

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
    [topRef, updateTopRect]
  );

  const onMouseDown = (e: React.MouseEvent) => {
    setSeparatorYPosition(e.clientY);
    setDragging(true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
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
    [dragging, separatorYPosition, topHeight, setTopHeight]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging) {
        e.preventDefault();
      }
      onMove(e.clientY);
    },
    [dragging, onMove]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (dragging) {
        e.preventDefault();
      }
      onMove(e.touches[0].clientY);
    },
    [dragging, onMove]
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

  const hitboxClasses = [
    styles['divider__hitbox'],
    dragging ? styles['divider__hitbox--dragging'] : '',
  ]
    .join(' ')
    .trim();

  return (
    <div className={wrapperClasses} ref={splitPaneRef}>
      <div className={styles['top-pane']} ref={topRef}>
        {top}
      </div>
      <div className={styles['divider']}>
        <div
          className={hitboxClasses}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        ></div>
      </div>
      <div className={styles['bottom-pane']}>{bottom}</div>
    </div>
  );
};
