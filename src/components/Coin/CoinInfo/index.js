import React, { useState } from "react";
import "./styles.css";

function CoinInfo({ heading, desc = "No description available." }) {
  const [expanded, setExpanded] = useState(false);
  const shortDesc = desc.length > 350 ? desc.slice(0, 350) + "..." : desc;

  return (
    <div className="grey-wrapper">
      <h2 className="coin-info-heading">{heading}</h2>
      <p className="coin-info-desc">
        {expanded ? desc : shortDesc}
        {desc.length > 350 && (
          <span className="read-more" onClick={() => setExpanded(!expanded)}>
            {expanded ? " Show Less" : " Read More..."}
          </span>
        )}
      </p>
    </div>
  );
}

export default CoinInfo;
