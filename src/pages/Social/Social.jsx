import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Helmet } from "react-helmet";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import "./Social.css";
import SocialCard from "../../components/SocialCard/SocialCard";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const Social = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isUserLoggedIn } = ChatState();
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };

      const { data } = await axios.get(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/users?search=${search}`,
        config
      );
      setSearchResult(data.users);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  useEffect(() => {
    if (!isUserLoggedIn.current) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="social-container">
      <Helmet>
        <title>FlagRush | Social</title>
      </Helmet>

      <motion.div
        className="social-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="social-title">Connect with Others</h1>
        <p className="social-subtitle">
          Find and connect with fellow CTF enthusiasts
        </p>

        <div className="search-container">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {loading && (
              <div className="search-loader">
                <BeatLoader size={8} color="#2563eb" />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="social-content">
        {searchResult.length > 0 ? (
          <div className="user-grid">
            {searchResult.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <SocialCard user={user} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {search ? (
              <p>No users found matching your search</p>
            ) : (
              <p>Start typing to search for users</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Social;
