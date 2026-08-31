import { useNavigate, useLocation } from "react-router-dom";

const OFFSET = 90;

function scrollToVisit() {
  const el = document.getElementById("visit");
  if (el) window.scrollTo({ top: el.offsetTop - OFFSET, behavior: "smooth" });
}

export default function useGoVisit() {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToVisit, 60);
    } else {
      scrollToVisit();
    }
  };
}
