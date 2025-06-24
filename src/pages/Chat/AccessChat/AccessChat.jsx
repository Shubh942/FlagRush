import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../../../context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../../context/ChatLogics";
import "./AcessChat.css";

const AccessChat = ({ messages, setMessages, socket, selectedChatCompare }) => {
  const { selectedChat, user } = ChatState();
  const [bool, setBool] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/message/${selectedChat._id}`,
        config
      );
      socket.emit("join chat", selectedChat._id);
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Show notification
      } else {
        setBool(!bool);
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };

    socket.on("message recieved", handleNewMessage);
    return () => socket.off("message recieved", handleNewMessage);
  }, [socket, selectedChatCompare, bool]);

  return (
    <div className="accesschat-container">
      {messages ? (
        messages.map((m, i) => (
          <div
            className={`accesschat-message ${
              m.sender._id === user.data.user._id
                ? "sent-message"
                : "received-message"
            }`}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user.data.user._id) ||
              isLastMessage(messages, i, user.data.user._id)) && (
              <img
                src={m.sender.photo}
                alt="sender"
                className="message-sender-avatar"
                style={{
                  marginRight: isSameSenderMargin(
                    messages,
                    m,
                    i,
                    user.data.user._id
                  ),
                  marginTop: isSameUser(messages, m, i, user.data.user._id)
                    ? "3px"
                    : "10px",
                }}
              />
            )}
            <div className="message-content">
              <p>{m.content}</p>
              <span className="message-time">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="loading-indicator">Loading messages...</div>
      )}
    </div>
  );
};

export default AccessChat;
