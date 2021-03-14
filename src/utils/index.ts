export function isTouchEvent(e: MouseEvent | TouchEvent) {
  return e.type.indexOf("touch") > -1;
}

export function getEventPostion(e: MouseEvent | TouchEvent) {
  let clientX = 0;
  let clientY = 0;

  if (isTouchEvent(e)) {
    clientX = (e as TouchEvent).touches[0].clientX;
    clientY = (e as TouchEvent).touches[0].clientY;
  } else {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }

  return { clientX, clientY };
}

export function getResizeBars(
  width: number
): Record<string, React.CSSProperties> {
  const defaultWidth = width + "px";
  const cornerWidth = width * 2 + "px";
  return {
    top: {
      top: 0,
      left: 0,
      right: 0,
      height: defaultWidth,
      cursor: "ns-resize",
      backgroundColor: "transparent",
      zIndex: 100,
    },
    bottom: {
      bottom: 0,
      left: 0,
      right: 0,
      height: defaultWidth,
      cursor: "ns-resize",
      backgroundColor: "transparent",
      zIndex: 100,
    },
    left: {
      top: 0,
      left: 0,
      bottom: 0,
      width: defaultWidth,
      cursor: "ew-resize",
      backgroundColor: "transparent",
      zIndex: 100,
    },
    right: {
      top: 0,
      right: 0,
      bottom: 0,
      width: defaultWidth,
      cursor: "ew-resize",
      backgroundColor: "transparent",
      zIndex: 100,
    },
    topLeft: {
      top: 0,
      left: 0,
      width: cornerWidth,
      height: cornerWidth,
      cursor: "nwse-resize",
      backgroundColor: "transparent",
      zIndex: 100,
    },
    bottomRight: {
      bottom: 0,
      right: 0,
      width: cornerWidth,
      height: cornerWidth,
      cursor: "nwse-resize",
      backgroundColor: "transparent",
      zIndex: 100,
    },
    topRight: {
      top: 0,
      right: 0,
      width: cornerWidth,
      height: cornerWidth,
      cursor: "nesw-resize",
      backgroundColor: "transparent",
      zIndex: 100,
    },
    bottomLeft: {
      left: 0,
      bottom: 0,
      width: cornerWidth,
      height: cornerWidth,
      cursor: "nesw-resize",
      backgroundColor: "transparent",
      zIndex: 100,
    },
  };
}
