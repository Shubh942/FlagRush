import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsGoogle, BsGithub, BsLinkedin } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ChatState } from "../../context/ChatProvider";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isUserLoggedIn } = ChatState();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password || !email) {
      toast.error("Please fill in all fields", { autoClose: 1000 });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://flagrush-backend-w1n5.onrender.com/api/v1/users/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.token) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        isUserLoggedIn.current = data;
        navigate("/discussion");
        toast.success("Logged in successfully!", { autoClose: 1000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>FlagRush | Login</title>
      </Helmet>

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Flag<span className="logo-accent">Rush</span>
          </motion.h1>
          <h2>Welcome Back</h2>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          <div className="forgot-password">
            <Link to="/forgotpassword">Forgot Password?</Link>
          </div>

          <motion.button
            type="submit"
            className="login-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? <BeatLoader color="#fff" size={10} /> : "Log In"}
          </motion.button>

          <div className="social-login">
            <p className="divider">or continue with</p>
            <div className="social-icons">
              <button type="button" className="social-icon">
                <BsGoogle />
              </button>
              <button type="button" className="social-icon">
                <BsGithub />
              </button>
              <button type="button" className="social-icon">
                <BsLinkedin />
              </button>
            </div>
          </div>
        </form>

        <div className="login-footer">
          <p>Don't have an account?</p>
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </div>
      </motion.div>

      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Login;
