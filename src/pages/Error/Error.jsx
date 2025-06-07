import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import error from '../../assets/error.png';
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
        <title>FlagRush | Page Not Found</title>
      </Helmet>
      <div className="error-content">
        <h1 className="error-heading">404 - Page Not Found</h1>
        <p className="error-message">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track!
        </p>
        <img src={errorImage} alt="Error 404" className="error-image" />
        <button className="error-btn" onClick={back}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Error;
