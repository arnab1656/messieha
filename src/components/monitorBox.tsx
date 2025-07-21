import React from 'react';

interface MonitorBoxProps {
  show: boolean;
  isCursorMoving: boolean;
  isInHitArea: boolean;
  isNextVisible: boolean;
  totalDistanceRef: React.MutableRefObject<number>;
  nextElementRef: React.MutableRefObject<HTMLDivElement | null>;
}

const MonitorBox: React.FC<MonitorBoxProps> = ({
  show,
  isCursorMoving,
  isInHitArea,
  isNextVisible,
  totalDistanceRef,
  nextElementRef,
}) => {
  return (
    <div
      className={`absolute top-4 right-4 z-50 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded ${show ? 'block' : 'hidden'}`}
    >
      Cursor: {isCursorMoving ? 'MOVING' : 'STILL'}
      <br />
      Hit Area: {isInHitArea ? 'INSIDE' : 'OUTSIDE'}
      <br />
      Shape: {isInHitArea || isCursorMoving ? 'POLYGON' : 'DOT'}
      <br />
      Animation: {isCursorMoving ? 'SMOOTH' : 'IDLE'}
      <br />
      Display: GSAP Controlled
      <br />
      Distance: {Math.round(totalDistanceRef.current)}px
      <br />
      Polygon: {nextElementRef.current?.style.clipPath?.slice(0, 30) || 'N/A'}
      ...
      <br />
      Next Visible: {isNextVisible ? 'YES' : 'NO'}
    </div>
  );
};

export default MonitorBox;
