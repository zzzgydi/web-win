import React, { useEffect, useRef, useState } from "react";
import { getResizeBars, getEventPostion, isTouchEvent } from "@/utils";

interface ChangeableProps {
  className?: string; // box className

  container?: HTMLElement; // default body
  dragger?: "self" | string;

  disableDrag?: boolean;
  disableResize?: boolean;

  top?: number;
  left?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;

  resizerWidth?: number;
}

const Changeable: React.FC<ChangeableProps> = (props) => {
  const { container = document.body } = props;

  const boxRef = useRef<HTMLDivElement>(null as any);
  const maskRef = useRef<HTMLDivElement>(null as any);
  const dragRef = useRef<HTMLElement>(null as any);

  const [boxStyle, setBoxStyle] = useState({
    top: props.top || 0,
    left: props.left || 0,
    width: typeof props.width === "number" ? props.width : 0,
    height: typeof props.height === "number" ? props.height : 0,
  });

  const stateRef = useRef({
    resizing: false,
    dragging: false,
    dir: "",
    originX: 0,
    originY: 0,
  });

  // 处理resizer bar
  const resizerWidth = Math.max(props.resizerWidth || 3, 0);
  const resizeBars = getResizeBars(resizerWidth);

  // handle mousemove
  // 包括resize和drag
  const onMouseMove = (e: MouseEvent | TouchEvent) => {
    const { resizing, dragging, originX, originY, dir } = stateRef.current;
    const { clientX, clientY } = getEventPostion(e);

    if (dragging || resizing) {
      try {
        e.preventDefault();
        e.stopPropagation();
      } catch (err) {}
    }

    // 正在拖拽
    if (dragging) {
      stateRef.current = {
        ...stateRef.current,
        originX: clientX,
        originY: clientY,
      };
      setBoxStyle((newStyle) => {
        let { left, top } = newStyle;
        left = left + clientX - originX;
        top = top + clientY - originY;
        return { ...newStyle, left, top };
      });
    }

    // 正在调整大小
    if (resizing) {
      stateRef.current = {
        ...stateRef.current,
        originX: clientX,
        originY: clientY,
      };
      setBoxStyle((newStyle) => {
        let { left, top, width, height } = newStyle;

        const deltaX = clientX - originX;
        const deltaY = clientY - originY;

        const minWidth = Math.max(props.minWidth || 0, 0);
        const minHeight = Math.max(props.minHeight || 0, 0);

        const canTop = height - deltaY >= minHeight;
        const canBottom = height + deltaY >= minHeight;
        const canLeft = width - deltaX >= minWidth;
        const canRight = width + deltaX >= minWidth;

        // handle top
        if (dir === "top" && canTop) {
          top = top + deltaY;
          height = height - deltaY;
        }
        // handle bottom
        else if (dir === "bottom" && canBottom) {
          height = height + deltaY;
        }
        // handle left
        else if (dir === "left" && canLeft) {
          left = left + deltaX;
          width = width - deltaX;
        }
        // handle right
        else if (dir === "right" && canRight) {
          width = width + deltaX;
        }
        // handle top and left
        else if (dir === "topLeft" && canTop && canLeft) {
          top = top + deltaY;
          height = height - deltaY;
          left = left + deltaX;
          width = width - deltaX;
        }
        // handle top and right
        else if (dir === "topRight" && canTop && canRight) {
          top = top + deltaY;
          height = height - deltaY;
          width = width + deltaX;
        }
        // handle bottom and left
        else if (dir === "bottomLeft" && canBottom && canLeft) {
          height = height + deltaY;
          left = left + deltaX;
          width = width - deltaX;
        }
        // handle bottom and right
        else if (dir === "bottomRight" && canBottom && canRight) {
          height = height + deltaY;
          width = width + deltaX;
        }
        // do not change anything
        else {
          stateRef.current = { ...stateRef.current, originX, originY };
        }

        return { ...newStyle, left, top, width, height };
      });
    }
  };

  // handle mouseend
  // 包括resize和drag
  const onMouseEnd = (e: MouseEvent | TouchEvent) => {
    const { resizing, dragging } = stateRef.current;
    container.style.cursor = "auto";

    // 结束变化
    if (resizing) {
      // console.log("end resize");
    }

    // 结束拖拽
    if (dragging) {
      // console.log("end drag");
    }

    if (maskRef.current) maskRef.current.style.display = "none";

    stateRef.current = {
      ...stateRef.current,
      resizing: false,
      dragging: false,
    };

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("touchmove", onMouseMove);
    document.removeEventListener("mouseup", onMouseEnd);
    document.removeEventListener("touchend", onMouseEnd);
  };

  // 绑定事件
  const bindEvent = () => {
    const someOption = { capture: true, passive: false };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onMouseMove, someOption);
    document.addEventListener("mouseup", onMouseEnd);
    document.addEventListener("touchend", onMouseEnd);
  };

  // resize start
  const onResizeStart = (
    e: React.MouseEvent | React.TouchEvent,
    dir: string
  ) => {
    if (props.disableResize) return;
    // 仅左键触发
    if (!isTouchEvent(e.nativeEvent) && (e as any).button !== 0) return;

    if (maskRef.current) maskRef.current.style.display = "block";

    bindEvent();
    const cursor = resizeBars[dir].cursor || "auto";
    container.style.cursor = cursor;
    const { clientX, clientY } = getEventPostion(e.nativeEvent);
    stateRef.current = {
      resizing: true,
      dragging: false, // 不允许拖拽
      dir,
      originX: clientX,
      originY: clientY,
    };
  };

  // drag start
  const onDragStart = (e: MouseEvent | TouchEvent) => {
    if (props.disableDrag) return;
    if (!dragRef.current || !boxRef.current) return;
    if (e.target !== dragRef.current) return;

    // 仅左键触发
    if (!isTouchEvent(e) && (e as any).button !== 0) return;

    if (maskRef.current) maskRef.current.style.display = "block";

    bindEvent();
    const { clientX, clientY } = getEventPostion(e);
    stateRef.current = {
      ...stateRef.current,
      resizing: false, // 不允许改变大小
      dragging: true,
      originX: clientX,
      originY: clientY,
    };
  };

  useEffect(() => {
    const { width = "auto", height = "auto" } = props;
    if (typeof width === "string" || typeof height === "string") {
      boxRef.current.style.width = width + "";
      boxRef.current.style.height = height + "";
      const { clientWidth, clientHeight } = boxRef.current;
      setBoxStyle((newStyle) => ({
        ...newStyle,
        width: clientWidth,
        height: clientHeight,
      }));
    }
  }, []);

  useEffect(() => {
    if (!props.dragger || !boxRef.current) return;

    if (props.dragger === "self") {
      dragRef.current = boxRef.current;
    } else {
      try {
        const dom = boxRef.current.querySelector<HTMLElement>(props.dragger);
        dragRef.current = dom!;
      } catch (err) {}
    }

    dragRef.current?.addEventListener("touchstart", onDragStart);
    dragRef.current?.addEventListener("mousedown", onDragStart);

    return () => {
      dragRef.current?.removeEventListener("touchstart", onDragStart);
      dragRef.current?.removeEventListener("mousedown", onDragStart);
    };
  }, [props.dragger]);

  return (
    <div
      ref={boxRef}
      className={props.className}
      style={{
        position: "absolute",
        width: boxStyle.width + "px",
        height: boxStyle.height + "px",
        top: boxStyle.top + "px",
        left: boxStyle.left + "px",
      }}
    >
      {Object.keys(resizeBars).map((key) => (
        <div
          key={key}
          style={{ position: "absolute", ...resizeBars[key] }}
          onMouseDown={(e) => onResizeStart(e, key)}
          onTouchStart={(e) => onResizeStart(e, key)}
        />
      ))}

      <div
        ref={maskRef}
        style={{
          display: "none",
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 99,
        }}
      />

      {props.children}
    </div>
  );
};

export default Changeable;
