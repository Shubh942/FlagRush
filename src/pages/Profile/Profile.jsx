import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import userpic from "../../assets/default.jpg";
import FriendCard from "../../components/FriendCard/FriendCard";
import FriendRequest from "../../components/FriendRequest/FriendRequest";
import { ChatState } from "../../context/ChatProvider";
import { FaUserFriends } from "react-icons/fa";
import { AiTwotoneEdit } from "react-icons/ai";
import { Helmet } from "react-helmet";
import "./Profile.css";

const Me = () => {
  const { slug } = useParams();
  const { user, isUserLoggedIn, openProfile } = ChatState();
  const [viewUser, setViewUser] = useState();
  const [isTrue, setIsTrue] = useState(false);
  const [request, setRequest] = useState(false);
  const [alreadyFriend, setAlreadyFriend] = useState(false);
  const [click, setClick] = useState(false);

  const pageLoad = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      const { data } = await axios.get(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/users/${slug}`,
        config
      );
      setViewUser(data.user[0]);

      // Check if current user is already a friend
      const isFriend = data.user[0].friends.some(
        (friend) =>
          friend._id ===
          JSON.parse(localStorage.getItem("userInfo")).data.user._id
      );
      setAlreadyFriend(isFriend);

      // Check if friend request already sent
      const hasRequest = data.user[0].friendsRequest.some(
        (req) =>
          req._id === JSON.parse(localStorage.getItem("userInfo")).data.user._id
      );
      setRequest(hasRequest);
    } catch (error) {
      console.error(error);
    }
  };

  const makeFriend = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };

      await axios.post(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/users/make-friend`,
        { friendId: viewUser._id },
        config
      );
      setIsTrue(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    pageLoad();
  }, [click, openProfile]);

  const currentUserId = JSON.parse(localStorage.getItem("userInfo")).data.user
    ._id;
  const isCurrentUser = currentUserId === (viewUser?._id || "");

  return (
    <div className="profile-page">
      <motion.div
        className="profile"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Helmet>
          <title>FlagRush | Profile</title>
        </Helmet>

        <div className="profile-content">
          <div className="profile-pic">
            <img
              src={viewUser?.photo || userpic}
              alt="user"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userpic;
              }}
            />
          </div>

          <div className="profile-content-details">
            {isCurrentUser && (
              <div className="profile-edit">
                <Link to="/registration">
                  <AiTwotoneEdit />
                </Link>
              </div>
            )}

            <h1>{viewUser?.name || ""}</h1>

            <div className="profile-content-friend">
              <FaUserFriends />
              <h3>Friend of {viewUser?.friends.length || 0} users</h3>
            </div>

            {JSON.parse(localStorage.getItem("userInfo")).data.user.role ===
              "admin" && (
              <div className="profile-admin">
                <Link to="/admin-chats">View Chats</Link>
                <Link to="/view-reports">View Reports</Link>
              </div>
            )}
          </div>
        </div>

        {!isCurrentUser && (
          <div className="profile-actions">
            {alreadyFriend ? (
              <div className="profile-status">You are friends</div>
            ) : request ? (
              <div className="profile-status">Request pending</div>
            ) : isTrue ? (
              <div className="profile-status">Request sent</div>
            ) : (
              <motion.button
                className="btn-cta-blue"
                onClick={makeFriend}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Make Connection
              </motion.button>
            )}
          </div>
        )}

        {isCurrentUser && (
          <>
            <motion.div
              className="friends-container"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2>Friends</h2>
              <div className="friends">
                <AnimatePresence>
                  {viewUser?.friends.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="friend-motion"
                    >
                      <FriendCard item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              className="friendrequest-container"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2>Pending Requests</h2>
              <div className="friendrequest-content">
                <AnimatePresence>
                  {viewUser?.friendsRequest.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="friend-motion"
                    >
                      <FriendRequest
                        item={item}
                        setClick={setClick}
                        click={click}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Me;
