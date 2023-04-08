import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useParams } from "react-router-dom";
import userpic from "../../assets/default.jpg";
import FriendCard from "../../components/FriendCard/FriendCard";
import FriendRequest from "../../components/FriendRequest/FriendRequest";
import { ChatState } from "../../context/ChatProvider";
import { FaUserFriends } from "react-icons/fa";
import { AiTwotoneEdit } from "react-icons/ai";
import {
  SiGithub,
  SiCodeforces,
  SiCodechef,
  SiLeetcode,
  SiGeeksforgeeks,
} from "react-icons/si";

import "./Profile.css";

const Me = () => {
  const { slug } = useParams();
  const { user, isUserLoggedIn, openProfile } = ChatState();
  // const { isUserLoggedIn } = GlobalProvider();
  const [viewUser, setViewUser] = useState();
  const [isTrue, setIsTrue] = useState(false);
  const [request, setRequest] = useState(false);
  const [alreadyFriend, setAlreadyFriend] = useState(false);
  const [click, setClick] = useState(false);
  // console.log(slug);



  const pageLoad = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/users/${slug}`,

        config
      );
      // console.log("-------------------data----------------");
      // console.log(data.user);
      // console.log(
      //   data.user[0].techStack ? data.user[0].techStack.split(" ") : ""
      // );

      // console.log(data.user[0]);
      setViewUser(data.user[0]);
      for (let i = 0; i < data.user[0].friends.length; i++) {
        if (
          data.user[0].friends[i]._id ===
          JSON.parse(localStorage.getItem("userInfo")).data.user._id
        ) {
          setAlreadyFriend(true);
        }
      }

      for (let i = 0; i < data.user[0].friendsRequest.length; i++) {
        if (
          data.user[0].friendsRequest[i]._id ===
          JSON.parse(localStorage.getItem("userInfo")).data.user._id
        ) {
          setRequest(true);
        }
      }
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
      const { data } = await axios.post(
        `http://localhost:5000/api/v1/users/make-friend`,
        { friendId: viewUser._id },

        config
      );
      setIsTrue(true);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    pageLoad();
  }, [click, openProfile]);

  return (
    <div className="profile">
      <div className="profile-content">
        <div className="profile-pic">
          <img src={viewUser ? viewUser.photo : ""} alt="user" />
        </div>
        <div className="profile-content-details">
          {JSON.parse(localStorage.getItem("userInfo")).data.user._id !==
          (viewUser ? viewUser._id : "") ? (
            ""
          ) : (
            <div className="profile-edit">
              <Link to="/registration">
                <AiTwotoneEdit />
              </Link>
            </div>
          )}

          <h1>{viewUser ? viewUser.name : ""}</h1>
          <h2>{viewUser ? viewUser.college : ""}</h2>
          <div className="profile-content-friend">
            <FaUserFriends />
            <h3>Friend of {viewUser ? viewUser.friends.length : ""} user</h3>
          </div>

          <div className="profile-admin">
            {JSON.parse(localStorage.getItem("userInfo")).data.user.role ===
            "admin" ? (
              // <button className="btn">View Chats</button>

              <Link to="/admin-chats">View Chats</Link>
            ) : (
              // <Link to="/view-reports">View Reports</Link>
              ""
            )}
            {JSON.parse(localStorage.getItem("userInfo")).data.user.role ===
            "admin" ? (
              <Link to="/view-reports">View Reports</Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {JSON.parse(localStorage.getItem("userInfo")).data.user._id !==
      (viewUser ? viewUser._id : "") ? (
        alreadyFriend ? (
          "Your are friends"
        ) : request ? (
          "already Requested"
        ) : isTrue ? (
          "Request sent"
        ) : (
          <button className="btn-cta-blue" onClick={makeFriend}>
            Make Connection
          </button>
        )
      ) : (
        ""
      )}
      <br />
      {JSON.parse(localStorage.getItem("userInfo")).data.user._id ===
      (viewUser ? viewUser._id : "") ? (
        <div className="friends">
          <h3>Friends</h3>
          {viewUser
            ? viewUser.friends.map((item) => (
                <FriendCard item={item} key={item._id} />
              ))
            : ""}
        </div>
      ) : (
        ""
      )}

      <br />

      {JSON.parse(localStorage.getItem("userInfo")).data.user._id ===
      (viewUser ? viewUser._id : "") ? (
        <div className="friendRequests">
          <h2>Request Pendings</h2>
          {viewUser.friendsRequest
            ? viewUser.friendsRequest.map((item) => (
                <FriendRequest
                  item={item}
                  key={item._id ? item._id : ""}
                  setClick={setClick}
                  click={click}
                />
              ))
            : ""}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Me;
