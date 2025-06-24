import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FriendCard.css";

const FriendCard = ({ item }) => {
  const navigate = useNavigate();

  const handleChat = async () => {
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
        `https://flagrush-backend-w1n5.onrender.com/api/v1/chat`,
        { userId: item._id },
        config
      );

      navigate("/chat");
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className="friend-card">
      <img
        src={item.photo || "/default-avatar.jpg"}
        alt="friend"
        className="friend-avatar"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-avatar.jpg";
        }}
      />
      <h3 className="friend-name">{item.name || "Unknown User"}</h3>
      <button className="chat-btn" onClick={handleChat}>
        <span>💬</span> Chat
      </button>
    </div>
  );
};
export default FriendCard;
