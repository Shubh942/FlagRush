import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import error from "../../assets/error.png";
import "./Error.css";
import axios from "axios";

const Error = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const back = () => {
    navigate(-1);
  };

  const handleSearch = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        },
      };

      const { data } = await axios.get(
        `https://error1.free.beeceptor.com/api/v1/users`,
        config
      );
      console.log(data.pic);
      setSearch(data.pic);
      // console.log(data.users);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    handleSearch();
  }, [search]);
  return (
    <div className="error">
      <h1>Error 404 page not found</h1>
      <div className="btn-cta-blue" onClick={back}>
        Go Back
      </div>
      <img src={search} alt="error 404" />
    </div>
  );
};

export default Error;
