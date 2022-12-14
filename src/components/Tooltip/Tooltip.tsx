import styles from './Tooltip.module.scss';
import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

export enum TooltipVariant {
  SUCCESS = 'success',
  INFO = 'info',
  WARN = 'warn',
  DANGER = 'danger',
}

export enum TooltipDirection {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}

const defaultProps = {
  delay: 0,
  direction: TooltipDirection.TOP,
  inline: false,
  directTabbable: true,
};

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
  variant?: TooltipVariant;
  direction?: TooltipDirection;
  inline?: boolean;
  directTabbable?: boolean;
}

export function Tooltip(props: TooltipProps & typeof defaultProps) {
  const {
    delay,
    variant,
    direction,
    inline,
    children,
    content,
    directTabbable,
  } = props;

  const [boundingRect, updateBoundingRect, anchorRef] =
    useBoundingRect<HTMLDivElement>();

  const portalEl = useRef<HTMLElement>();
  const [mounted, setMounted] = useState(false);
  const timeout = useRef<number>();
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (hovered || focused) {
      updateBoundingRect();
      timeout.current = setTimeout(() => {
        setActive(true);
      }, delay) as unknown as number;
    } else {
      clearInterval(timeout.current);
      setActive(false);
    }
  }, [hovered, focused, updateBoundingRect, delay]);

  const anchorClassNames = useMemo(() => {
    const result = [styles['tooltip-anchor']];
    if (inline) {
      result.push(styles['tooltip-anchor--inline']);
    }
    return result.join(' ');
  }, [inline]);

  const classNames = useMemo(() => {
    const result = [styles['tooltip'], styles[`tooltip--${direction}`]];
    if (variant) {
      result.push(styles[`tooltip--${variant}`]);
    }
    return result.join(' ');
  }, [variant, direction]);

  const { top, left } = useMemo(() => {
    if (!boundingRect) {
      return { top: 0, left: 0 };
    }

    const { top, left, bottom, right, height, width } = boundingRect;

    switch (direction) {
      case TooltipDirection.TOP:
        return {
          top,
          left: left + width / 2,
        };
      case TooltipDirection.RIGHT:
        return {
          top: top + height / 2,
          left: right,
        };
      case TooltipDirection.BOTTOM:
        return {
          top: bottom,
          left: left + width / 2,
        };
      case TooltipDirection.LEFT:
        return {
          top: top + height / 2,
          left,
        };
    }
  }, [boundingRect, direction]);

  useEffect(() => {
    portalEl.current = document.getElementById('tooltip-portal')!;
    setMounted(true);
  }, []);

  return (
    <div
      ref={anchorRef}
      className={anchorClassNames}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseUp={() => setFocused(false)}
      tabIndex={directTabbable ? 0 : -1}
    >
      {children}
      {active &&
        mounted &&
        portalEl.current &&
        createPortal(
          <div className={styles['tooltip-wrapper']} style={{ top, left }}>
            <div className={classNames}>{content}</div>
          </div>,
          portalEl.current
        )}
    </div>
  );
}

Tooltip.defaultProps = defaultProps;

function useBoundingRect<T extends HTMLElement>(): [
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
