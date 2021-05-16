import React, { useEffect, useState } from 'react';
import Header from './Header';

const Layout = props => {

  const [showArrow, setShowArrow] = useState(false);

  const checkScrollTop = () => {
    if (!showArrow && window.pageYOffset > 200) {
      setShowArrow(true)
    } else if (showArrow && window.pageYOffset <= 200) {
      setShowArrow(false)
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    }
  });

  const arrow = <div onClick={scrollTop} className={props.styles + " b f3 pointer fixed bottom-1 right-2 dark-gray"}>^</div>;

  return <div className="center w85">
    <Header />
    <div className="ph3 pv1 background-gray">
      {props.children}
      {showArrow ? arrow : null}
    </div>
  </div>
}

export default Layout;