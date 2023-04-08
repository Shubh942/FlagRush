import React from "react";
import "./FlagCard.css";

const FlagCard = ({ object }) => {
  return (
    <div className="flagBox">
      <h2>{object ? object.heading : ""}</h2>
      <div>Discription: {object ? object.description : ""}</div>
      <div>Link: {object ? object.link : ""}</div>
      <div>Hint: {object ? object.hint : ""}</div>
    </div>
  );
};

export default FlagCard;
