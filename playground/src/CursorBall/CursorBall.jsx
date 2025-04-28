import { useState } from 'react';

export const CursorBall = () => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX + window.scrollX,
          y: e.clientY + window.scrollY
        });
      }}
      style={{
        width: '500px',
        height: '500px',
        border: '1px solid #333'
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
