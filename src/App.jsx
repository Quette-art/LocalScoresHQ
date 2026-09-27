import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppContent from "./AppContent";
import "./components/ScoresTab.css";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
