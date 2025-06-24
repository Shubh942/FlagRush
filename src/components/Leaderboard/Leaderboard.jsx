import React, { useEffect, useState } from "react";
import "./Leaderboard.css";
import { Link, NavLink, redirect, useNavigate } from "react-router-dom";
import axios from "axios";
const Leaderboard = () => {
  const [ranking, setRanking] = useState([]);
  const pageLoad = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get(
      `https://flagrush-backend-w1n5.onrender.com/api/v1/ctf/leaderboard`,
      config
    );
    console.log(data);
    setRanking(data.users);
  };
  useEffect(() => {
    pageLoad();
  }, []);
  return (
    <div className="leader-box">
      <h2>Leaderboard</h2>
      <div className="leader-div">
        {ranking.length > 0
          ? ranking.map((user) => (
              <div className="leaderCard">
                <div className="leaderCard-profile">
                  <img src={user.photo} alt="" />
                  <Link to={`/profile/${user.name}`} className="leader-name">
                    <a>{user.name}</a>
                  </Link>
                </div>
                <a>{user.totalCtfs}</a>
              </div>
            ))
          : "Loading....."}
      </div>
    </div>
  );
};

export default Leaderboard;
