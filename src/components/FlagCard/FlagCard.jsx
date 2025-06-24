import React, { useState } from "react";
import "./FlagCard.css";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { ChatState } from "../../context/ChatProvider";

const FlagCard = ({ object }) => {
  const { isUserLoggedIn } = ChatState();
  const [flag, setFlag] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const submitFlag = async () => {
    if (!flag.trim()) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };

      const { data } = await axios.post(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/ctf/submitFlag`,
        { flag: flag.trim(), ctfId: object._id },
        config
      );

      setLoading(false);
      if (data.data.status === "success") {
        setFlag("");
        setIsSolved(true);
        toast.success(data.data.message, { autoClose: 2500 });
      } else {
        toast.error(data.data.message, { autoClose: 1000 });
      }
    } catch (error) {
      setLoading(false);
      toast.error("Entered Flag is not correct, Please try again", {
        autoClose: 1000,
      });
      console.error("Flag submission error:", error);
    }
  };

  const isChallengeSolved = object?.users?.includes(
    isUserLoggedIn.current.data.user._id
  );

  return (
    <div className="flag-card">
      <div className="flag-header">
        <h2 className="flag-title">{object?.heading || "Challenge"}</h2>
        {isChallengeSolved && <div className="solved-badge">Solved ✓</div>}
      </div>

      <div className="flag-content">
        <p className="flag-description">
          <strong>Description:</strong>{" "}
          {object?.description || "No description provided"}
        </p>

        <div className="flag-link">
          <span>🔗</span>
          <a href={object?.link} target="_blank" rel="noopener noreferrer">
            {object?.link || "No link provided"}
          </a>
        </div>

        <div className="flag-author">
          <img
            src={object?.host?.photo || "/default-avatar.jpg"}
            alt="Author"
            className="author-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.jpg";
            }}
          />
          <span className="author-name">
            Author: {object?.host?.name || "Unknown"}
          </span>
        </div>

        {object?.hint && (
          <div className="flag-hint">
            <strong>Hint:</strong>
            <div className="hint-toggle" onClick={() => setShowHint(!showHint)}>
              {showHint ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </div>
            {showHint && <div className="hint-content">{object.hint}</div>}
          </div>
        )}
      </div>

      {!isChallengeSolved && (
        <div className="flag-input-container">
          <TextField
            label="Enter the flag"
            variant="filled"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            className="flag-input"
            disabled={loading}
          />
          <button
            className="submit-btn"
            onClick={submitFlag}
            disabled={loading || !flag.trim()}
          >
            {loading ? <BeatLoader color="#fff" size={10} /> : <>Submit Flag</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default FlagCard;
