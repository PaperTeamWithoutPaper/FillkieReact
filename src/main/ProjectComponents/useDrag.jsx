import { useState, useEffect } from 'react';

const useDrag = (ref, deps = [], options) => {
  const {
    onPointerDown = () => {},
    onPointerUp = () => {},
    onPointerMove = () => {},
    onDrag = () => {},
  } = options;  

  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e) => {
    setIsDragging(true);

    onPointerDown(e);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    console.log('out')
    onPointerUp(e);
  };

  const handlePointerMove = (e) => {
    onPointerMove(e);
    if (isDragging) {
      onDrag(e);
    }
  };
  const handleMouseOut = (e) => {
    setIsDragging(false);
    console.log('out')
    onPointerUp(e);
  };



  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', handlePointerDown);
      element.addEventListener('mouseup', handlePointerUp);
      element.addEventListener('mousemove', handlePointerMove);
      element.addEventListener('mouseleave', handleMouseOut);

      return () => {
        element.removeEventListener('mousedown', handlePointerDown);
        element.removeEventListener('mouseup', handlePointerUp);
        element.removeEventListener('mousemove', handlePointerMove);
        element.removeEventListener('mouseleave', handleMouseOut);
      };
    }

    return () => {};
  }, [...deps, isDragging]);

  return { isDragging };
};

export default useDrag;