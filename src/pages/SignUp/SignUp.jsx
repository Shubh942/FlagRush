import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { BeatLoader } from "react-spinners";
import { motion } from "framer-motion";
import "./SignUp.css";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const handleClick = () => setShow(!show);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword || !password || !name) {
      toast.error("Passwords do not match!", { autoClose: 1000 });
      return;
    } else {
      try {
        const config = { headers: { "content-type": "application/json" } };
        setLoading(true);
        const { data } = await axios.post(
          "https://flagrush-backend-w1n5.onrender.com/api/v1/users/signup",
          { name, email, password, confirmPassword, photo: pic },
          config
        );
        toast.success("Check mail for verification", { autoClose: 1000 });
        setLoading(false);
        if (!data.token) {
          toast.error("Invalid credentials", { autoClose: 1000 });
          setLoading(false);
        } else {
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setPic(null);
          setFilePreview(null);
          setLoading(false);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "An error occurred", {
          autoClose: 1000,
        });
        setLoading(false);
      }
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (!pics) {
      toast.error("Please select an image", { autoClose: 1000 });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const reader = new FileReader();
      reader.readAsDataURL(pics);
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };

      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "codenova");
      data.append("cloud_name", "df4t1zu7e");

      fetch("https://api.cloudinary.com/v1_1/df4t1zu7e/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to upload image", { autoClose: 1000 });
          setLoading(false);
        });
    } else {
      toast.error("Please select a JPEG or PNG image", { autoClose: 1000 });
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Helmet>
        <title>FlagRush | Sign Up</title>
      </Helmet>

      <motion.div
        className="signup-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="signup-header">
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Flag<span className="logo-accent">Rush</span>
          </motion.h2>
          <h3>Create Your Account</h3>
        </div>

        <form onSubmit={submitHandler} className="signup-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={handleClick}
            >
              {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          <div className="input-group">
            <input
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div
            className={`file-upload ${filePreview ? "has-preview" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <label htmlFor="profile-pic">
              <div className="upload-content">
                {filePreview ? (
                  <div className="image-preview">
                    <img src={filePreview} alt="Preview" />
                    {isHovered && (
                      <div className="change-photo">
                        <AiOutlineCloudUpload />
                        <span>Change Photo</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <AiOutlineCloudUpload className="upload-icon" />
                    <span>Upload Profile Picture</span>
                  </>
                )}
              </div>
              <input
                id="profile-pic"
                type="file"
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
                hidden
              />
            </label>
          </div>

          <motion.button
            type="submit"
            className="signup-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? <BeatLoader color="#fff" size={10} /> : "Sign Up"}
          </motion.button>
        </form>

        <div className="signup-footer">
          <p>Already have an account?</p>
          <Link to="/login" className="login-link">
            Log In
          </Link>
        </div>
      </motion.div>
      {/* 
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
      /> */}
    </div>
  );
};

export default SignUp;
