import React from 'react';
import { useNavigate } from 'react-router-dom';
import comingSoon from '../../assets/coming-soon.avif';
import './Error.css';
import { Helmet } from 'react-helmet';

const Error = () => {
  const navigate = useNavigate();

  const back = () => {
    navigate(-1);
  };

  return (
    <div className="error-page">
      <Helmet>
        <title>FlagRush | Coming Soon</title>
      </Helmet>
      <div className="error-content">
        <h1 className="error-heading">Feature Coming Soon!</h1>
        <p className="error-message">
          We're working hard to bring you this exciting new feature. Stay tuned
          for updates!
        </p>
        <img src={comingSoon} alt="Coming soon" className="error-image" />
        <button className="error-btn" onClick={back}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Error;
