import React, { useState, useEffect } from "react";
import ChatName from "./Name/ChatName";
import { ChatState } from "../../context/ChatProvider";
import "./Chat.css";
import AccessChat from "./AccessChat/AccessChat";
import { AiOutlineSend, AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import io from "socket.io-client";
import axios from "axios";

const ENDPOINT = "https://flagrush-backend-w1n5.onrender.com/";
var socket, selectedChatCompare;
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // for mobile
  const [showChat, setShowChat] = useState(false); // for mobile

  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    isUserLoggedIn,
  } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn.current) {
      navigate("/login");
    }

    socket = io(ENDPOINT);
    socket.emit(
      "setup",
      JSON.parse(localStorage.getItem("userInfo"))?.data.user || ""
    );
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, []);

  // Show/hide sidebar/chat on mobile
  useEffect(() => {
    if (window.innerWidth <= 992) {
      if (selectedChat) {
        setShowSidebar(false);
        setShowChat(true);
      } else {
        setShowSidebar(true);
        setShowChat(false);
      }
    }
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "https://flagrush-backend-w1n5.onrender.com/api/v1/message",
        {
          content: newMessage.trim(),
          chatId: selectedChat._id,
        },
        config
      );

      setNewMessage("");
      socket.emit("new message", data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Back button for mobile
  const handleBack = () => {
    setSelectedChat(null);
    setShowSidebar(true);
    setShowChat(false);
  };

  // Responsive rendering
  return (
    <div className="chat-page">
      <div className="chat-container">
        <Helmet>
          <title>FlagRush | Chat</title>
        </Helmet>

        {/* Sidebar */}
        <div
          className={`chat-sidebar${showSidebar ? "" : " hide-on-mobile"}`}
          style={{ display: showSidebar ? "flex" : "none" }}
        >
          <ChatName
            onChatSelect={() => {
              if (window.innerWidth <= 992) {
                setShowSidebar(false);
                setShowChat(true);
              }
            }}
          />
        </div>

        {/* Main chat */}
        <div
          className={`chat-main${showChat ? "" : " hide-on-mobile"}`}
          style={{
            display: showChat || window.innerWidth > 992 ? "flex" : "none",
          }}
        >
          {/* Back button for mobile */}
          {window.innerWidth <= 992 && (
            <button className="chat-back-btn" onClick={handleBack}>
              <AiOutlineArrowLeft size={22} />
              Back
            </button>
          )}
          <div className="chat-messages">
            <AccessChat
              messages={messages}
              setMessages={setMessages}
              socket={socket}
              selectedChatCompare={selectedChatCompare}
            />
          </div>
          <div className="chat-input-container">
            <input
              className="chat-input"
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <AiOutlineSend style={{ fontSize: "20px" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
