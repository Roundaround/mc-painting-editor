import React, {
  BaseHTMLAttributes,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useBoundingRect } from '../../utils/useBoundingRect';
import styles from './SplitPane.module.scss';

const MIN_WIDTH = 380;

interface SplitPaneProps extends BaseHTMLAttributes<HTMLDivElement> {
  children: [ReactElement, ReactElement];
}

export const SplitPane = (props: SplitPaneProps) => {
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
    [leftRef, updateLeftRect]
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
    [dragging, leftWidth, separatorXPosition, setLeftWidth]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      onMove(e.clientX);
    },
    [onMove]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      onMove(e.touches[0].clientX);
    },
    [onMove]
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
      <div className={styles['left-pane']} ref={leftRef}>
        {left}
      </div>
      <div className={styles['divider']}>
        <div
          className={hitboxClasses}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        ></div>
      </div>
      <div className={styles['right-pane']}>{right}</div>
    </div>
  );
};
