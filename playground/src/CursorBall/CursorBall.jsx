import { useState } from 'react';

export const CursorBall = () => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  return (
    <div
      onPointerMove={(e) => {
        // const dom = e.target;
        // let domToTop = dom.getBoundingClientRect().top; // dom 的顶边到视口顶部的距离
        // let domToLeft = dom.getBoundingClientRect().left; // dom 的左边到视口左边的距离
        // let domToBottom = dom.getBoundingClientRect().bottom; // dom 的底边到视口顶部的距离
        // let domToRight = dom.getBoundingClientRect().right; // dom 的右边到视口左边的距离

        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'fixed',
        zIndex: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20
        }}
      ></div>
    </div>
  );
};
