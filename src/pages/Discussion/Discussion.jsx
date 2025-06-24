import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Helmet } from "react-helmet";
import axios from "axios";
import "./Discussion.css";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DiscussionCard from "../../components/DiscussionCard/DiscussionCard";

const Discussion = () => {
  const { user, setUser, isUserLoggedIn } = ChatState();

  const [newDiscussion, setNewDiscussion] = useState("");
  const [discussion, setDiscussion] = useState([]);
  const [discussionName, setDiscussionName] = useState("");
  const [discription, setDiscription] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const handleClick = async () => {
    if (!discussionName) {
      toast.error("Enter discussion Name", {
        autoClose: 1000,
      });
    } else {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `https://flagrush-backend-w1n5.onrender.com/api/v1/chat/create-discussion`,
          {
            chatName: discussionName,
            discription: discription,
            code: code,
          },
          config
        );
        toast.success("New discussion added", {
          autoClose: 1000,
        });
        setNewDiscussion(data);

        // console.log(data);
        setCode("");
        setDiscription("");
        setDiscussionName("");
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
          autoClose: 1000,
        });
      }
    }
  };
  const pageLoad = async () => {
    // console.log("inside page load");
    // console.log(user);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      const { data } = await axios.get(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/chat/discussion`,
        config
      );
      setDiscussion(data);
      //   console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // window.addEventListener("beforeunload", pageLoad);

  useEffect(() => {
    if (!isUserLoggedIn.current) {
      console.log(isUserLoggedIn.current);
      navigate("/login");
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    pageLoad();
    // console.log("working");
  }, []);

  useEffect(() => {
    setDiscussion([...discussion, newDiscussion]);
  }, [newDiscussion]);

  return (
    <div className="discussion-page">
      <div className="discussion-container">
        <Helmet>
          <title>FlagRush | Discussion</title>
        </Helmet>

        <div className="discussion-header">
          <h1>Community Discussions</h1>
          <p>Ask questions and share knowledge with the community</p>
        </div>

        {/* Discussion Form */}
        <div className="discussion-form">
          <h2 className="form-title">Start a New Discussion</h2>
          <div className="discussion-form-grid">
            <TextField
              label="Discussion Title"
              variant="filled"
              value={discussionName}
              onChange={(e) => setDiscussionName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Detailed Description"
              variant="filled"
              multiline
              rows={4}
              value={discription}
              onChange={(e) => setDiscription(e.target.value)}
              fullWidth
            />

            <TextField
              label="Relevant Code (optional)"
              variant="filled"
              multiline
              rows={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
            />

            <div className="form-submit">
              <button className="btn-primary" onClick={handleClick}>
                Post Discussion
              </button>
            </div>
          </div>
        </div>

        {/* Discussions List */}
        <div className="discussions-list">
          {discussion && discussion.length > 0 ? (
            discussion.map((item) => (
              <DiscussionCard item={item} key={item._id || Math.random()} />
            ))
          ) : (
            <div className="empty-state">
              <p>No discussions yet. Be the first to start one!</p>
            </div>
          )}
        </div>

        {/* <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      /> */}
      </div>
    </div>
  );
};
export default Discussion;
