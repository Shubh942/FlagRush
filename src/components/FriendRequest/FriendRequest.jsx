import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FriendRequest.css";

const FriendRequest = ({ item, setClick, click }) => {
  const [color, setColor] = useState(item.isResolved ? item.isResolved : false);

  const handleAccept = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      const { data } = await axios.post(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/users/accept-request`,
        { friendId: item._id, accept: true },
        config
      );
      setClick(!click);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecline = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      const { data } = await axios.post(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/users/accept-request`,
        { friendId: item._id, accept: false },
        config
      );
      setClick(!click);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="friend-request-card">
      <div className="request-header">
        <img
          src={item.photo || "/default-avatar.jpg"}
          alt="user"
          className="request-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.jpg";
          }}
        />
        <p className="request-title">Friend Request</p>
        <h3 className="request-username">{item.name}</h3>
      </div>

      <div className="request-actions">
        <button className="request-btn accept" onClick={handleAccept}>
          ✓ Accept
        </button>
        <button className="request-btn decline" onClick={handleDecline}>
          ✕ Decline
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
