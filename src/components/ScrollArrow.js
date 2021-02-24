import React, { useEffect, useState, useCallback } from 'react';

const ScrollArrow = props => {

  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = useCallback(() => {
    if (!showScroll && window.pageYOffset > 200) {
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 200) {
      setShowScroll(false)
    }
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('scroll', checkScrollTop);

  useEffect(() => {
    console.log('MOUNT ARROW');
    return () => {
      console.log('UNMOUNT ARROW');
      window.removeEventListener('scroll', checkScrollTop)
    }
  }, []);

  return (
    <div
      onClick={scrollTop}
      className={props.styles + "b f3 pointer dark-gray"}
      style={{ display: showScroll ? 'block' : 'none' }}>^</div>
  );
}

export default ScrollArrow;