import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopOnRouteChange = ({ lenis }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (!lenis) return;

        lenis.scrollTo(0, {
            immediate: true,
        });
    }, [pathname, lenis]);

    return null;
};

export default ScrollToTopOnRouteChange;