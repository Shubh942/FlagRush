import React, { useEffect, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import axios from "axios";
// import ChatNameAvatar from "./ChatNameAvatar/ChatNameAvatar";

import "./ChatName.css";

const ENDPOINT = "https://flagrush-backend-w1n5.onrender.com/";
var socket, selectedChatCompare;
const ChatName = ({ onChatSelect }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };

      const { data } = await axios.get(
        "https://flagrush-backend-w1n5.onrender.com/api/v1/chat",
        config
      );
      setChats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  const getChatPartner = (chat) => {
    if (!chat.users || chat.users.length === 0) return null;
    return chat.users[0]._id === user.data.user._id
      ? chat.users[1]
      : chat.users[0];
  };

  return (
    <div className="chat-list-container">
      {chats.length > 0 ? (
        chats.map((chat) => {
          const partner = getChatPartner(chat);
          return (
            <div
              className={`chat-item ${
                selectedChat?._id === chat._id ? "active" : ""
              }`}
              key={chat._id}
              onClick={() => {
                setSelectedChat(chat);
                if (onChatSelect) onChatSelect();
              }}
            >
              <div className="avatar-container">
                {partner?.photo && (
                  <>
                    <img
                      src={partner.photo}
                      alt={partner.name}
                      className="chat-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.jpg";
                      }}
                    />
                    {/* <div className="online-status"></div> */}
                  </>
                )}
              </div>
              <div>
                <div className="chat-name">
                  {partner?.name || "Unknown User"}
                </div>
                {/* <div className="last-message">
                  {chat.latestMessage?.content || 'No messages yet'}
                </div> */}
              </div>
            </div>
          );
        })
      ) : (
        <div className="empty-state">
          <p>No chats yet. Start a new conversation!</p>
        </div>
      )}
    </div>
  );
};

export default ChatName;
