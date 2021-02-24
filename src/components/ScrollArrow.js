import React, { useCallback, useEffect, useState } from 'react';

const ScrollArrow = React.memo(props => {

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
    // console.log('MOUNT ARROW');
    return () => {
      // console.log('UNMOUNT ARROW');
      window.removeEventListener('scroll', checkScrollTop)
    }
  }, [checkScrollTop]);

  return (
    <div
      onClick={scrollTop}
      className={props.styles + " b f3 pointer fixed bottom-1 right-2 dark-gray"}
      style={{ display: showScroll ? 'block' : 'none' }}>^</div>
  );
});

export default ScrollArrow;