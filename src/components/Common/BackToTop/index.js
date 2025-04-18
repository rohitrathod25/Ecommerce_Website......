import React, { useEffect, useState } from "react";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import "./styles.css";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button 
      className="back-to-top-btn" 
      onClick={scrollToTop} 
      style={{ display: visible ? "block" : "none" }}
    >
      <ArrowUpwardRoundedIcon style={{ color: "var(--blue)" }} />
    </button>
  );
}

export default BackToTop;
