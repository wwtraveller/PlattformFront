import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scroll({
          top: 0,
       //    behavior: 'smooth', плавная прокрутка, если хотите
        });
      }, [pathname]);
    return null;
};

export default ScrollToTop;
