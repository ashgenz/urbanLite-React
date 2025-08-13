// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ paths }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (paths.includes(pathname)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, paths]);

  return null;
}
