"use client";
import { useCallback, useRef, useState } from "react";

const useLongPress = (
  onLongPress: (a: any) => void,
  onClick: () => void,
  { shouldPreventDefault = true, delay = 300 } = {},
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.TouchEventHandler<HTMLDivElement>,
    ) => {
      // @ts-ignore
      if (shouldPreventDefault && event?.target && target.current) {
        // @ts-ignore
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        // @ts-ignore
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault],
  );

  const clear = useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.TouchEventHandler<HTMLDivElement>,
      shouldTriggerClick = true,
    ) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerClick && !longPressTriggered && onClick();
      setLongPressTriggered(false);
      if (shouldPreventDefault && target.current) {
        // @ts-ignore
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered],
  );

  return {
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => start(e),
    onTouchStart: (e: React.TouchEventHandler<HTMLDivElement>) => start(e),
    onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => clear(e),
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => clear(e, false),
    onTouchEnd: (e: React.TouchEventHandler<HTMLDivElement>) => clear(e),
  };
};

const isTouchEvent = (
  event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
) => {
  return "touches" in event;
};

const preventDefault = (event: React.TouchEvent<HTMLDivElement>) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

export default useLongPress;
