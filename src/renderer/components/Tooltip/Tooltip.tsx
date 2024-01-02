import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { clsxm } from '$renderer/utils/clsxm';
import { useBoundingRect } from '$renderer/utils/useBoundingRect';

import styles from './Tooltip.module.scss';

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
  noWrap: false,
};

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
  direction?: TooltipDirection;
  inline?: boolean;
  directTabbable?: boolean;
  noWrap?: boolean;
  force?: boolean;
}

export type TooltipPropsSansChildren = Omit<TooltipProps, 'children'>;

export function Tooltip(props: TooltipProps & typeof defaultProps) {
  const {
    delay,
    direction,
    inline,
    children,
    content,
    directTabbable,
    noWrap,
    force,
  } = props;

  const [boundingRect, updateBoundingRect, anchorRef] =
    useBoundingRect<HTMLDivElement>();
  const [contentRect, updateContentRect, contentRef] =
    useBoundingRect<HTMLDivElement>();

  const portalEl = useRef<HTMLElement>();
  const [mounted, setMounted] = useState(false);
  const timeout = useRef<number>();
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (force || hovered || focused) {
      updateBoundingRect();
      timeout.current = window.setTimeout(() => {
        setActive(true);
      }, delay);
    } else {
      clearInterval(timeout.current);
      setActive(false);
    }
  }, [force, hovered, focused, updateBoundingRect, updateContentRect, delay]);

  useEffect(() => {
    updateContentRect();
  }, [active]);

  const classNames = ['tooltip', `tooltip--${direction}`]
    .map((name) => styles[name as keyof typeof styles])
    .join(' ')
    .trim();

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

  const { contentWidth, contentHeight } = useMemo(() => {
    if (!contentRect) {
      return {
        contentWidth: 0,
        contentHeight: 0,
      };
    }

    return {
      contentWidth: contentRect.width,
      contentHeight: contentRect.height,
    };
  }, [contentRect]);

  const offset = useMemo(() => {
    if (
      direction === TooltipDirection.LEFT ||
      direction === TooltipDirection.RIGHT
    ) {
      const topSide = top - contentHeight / 2;
      const bottomSide = top + contentHeight / 2;
      if (topSide < 0) {
        return -topSide + 4;
      } else if (bottomSide > window.innerHeight) {
        return window.innerHeight - bottomSide - 4;
      }

      return 0;
    }

    const leftSide = left - contentWidth / 2;
    const rightSide = left + contentWidth / 2;
    if (leftSide < 0) {
      return -leftSide + 4;
    } else if (rightSide > window.innerWidth) {
      return window.innerWidth - rightSide - 4;
    }

    return 0;
  }, [direction, left, contentWidth]);

  useEffect(() => {
    portalEl.current = document.getElementById('tooltip-portal')!;
    setMounted(true);
  }, []);

  return (
    <div
      ref={anchorRef}
      className={clsxm('relative block focus-visible:rounded-md', {
        'inline-block': inline,
      })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseUp={() => setFocused(false)}
      tabIndex={directTabbable ? 0 : -1}
    >
      {children}
      <>
        {active && mounted && portalEl.current
          ? createPortal(
              <div
                className={clsxm(styles['tooltip-wrapper'], 'z-50')}
                style={{ top, left }}
              >
                <div
                  className={clsxm(
                    classNames,
                    'rounded-md bg-neutral-800 px-4 py-2 text-gray-100 shadow-xl',
                    {
                      'before:border-t-neutral-800':
                        direction === TooltipDirection.TOP,
                      'before:border-r-neutral-800':
                        direction === TooltipDirection.RIGHT,
                      'before:border-b-neutral-800':
                        direction === TooltipDirection.BOTTOM,
                      'before:border-l-neutral-800':
                        direction === TooltipDirection.LEFT,
                      'whitespace-nowrap': noWrap,
                    },
                  )}
                  ref={contentRef}
                  style={
                    {
                      '--tooltip-offset': `${offset}px`,
                    } as CSSProperties
                  }
                >
                  {content}
                </div>
              </div>,
              portalEl.current,
            )
          : null}
      </>
    </div>
  );
}

Tooltip.defaultProps = defaultProps;

export function isTooltipProps(
  tooltip: ReactNode | TooltipPropsSansChildren,
): tooltip is TooltipPropsSansChildren {
  return (tooltip as TooltipPropsSansChildren).content !== undefined;
}

export default Tooltip;
