import React, { useState, useEffect } from 'react';
import ChatName from './Name/ChatName';
import { ChatState } from '../../context/ChatProvider';
// import { ChatState } from "../../context/ChatProvider";
import './Chat.css';
import AccessChat from './AccessChat/AccessChat';
import MessageBox from './MessageBox/MessageBox';
import axios from 'axios';
import io from 'socket.io-client';
import { AiOutlineSend } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Helmet } from 'react-helmet';

const ENDPOINT = 'http://localhost:5000/';
var socket, selectedChatCompare;
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
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
      navigate('/login');
    }

    socket = io(ENDPOINT);
    socket.emit(
      'setup',
      JSON.parse(localStorage.getItem('userInfo'))?.data.user || ''
    );
    socket.on('connected', () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/v1/message',
        {
          content: newMessage.trim(),
          chatId: selectedChat._id,
        },
        config
      );

      setNewMessage('');
      socket.emit('new message', data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <Helmet>
        <title>FlagRush | Chat</title>
      </Helmet>

      <div className="chat-sidebar">
        <ChatName />
      </div>

      <div className="chat-main">
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
            <AiOutlineSend style={{ fontSize: '20px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Chat;
