import React from "react";
import { useNavigate } from "react-router-dom";
import comingSoon from "../../assets/coming-soon.avif";
import "./Error.css";

const Error = () => {
  const navigate = useNavigate();

  const back = () => {
    navigate(-1);
  };

  return (
    <div className="error">
      <h1>the Feature will be implemented soon !!</h1>
      <div className="btn-cta-blue" onClick={back}>
        Go Back
      </div>
      <img src={comingSoon} alt="error 404" />
    </div>
  );
};

export default Error;
