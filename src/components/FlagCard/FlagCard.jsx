import React from "react";
import './FlagCard.css';

const FlagCard = ({ object }) => {
  return (
    <div className="flagBox">
      <h2>{object ? object.heading : ''}</h2>
      <div>{object ? object.description : ''}</div>
      <div>{object ? object.link : ''}</div>
      <div>{object ? object.hint : ''}</div>
    </div>
  );
}

export default FlagCard;