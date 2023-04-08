import React, { useState } from "react";
import "./FlagCard.css";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "../../context/ChatProvider";

const FlagCard = ({ object }) => {
  const { isUserLoggedIn } = ChatState();
  const [flag, setFlag] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const submitFlag = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      const data = await axios.post(
        `http://localhost:5000/api/v1/ctf/submitFlag`,
        { flag: flag, ctfId: object._id },
        config
      );
      console.log(data);
      setLoading(false);
      if (data.data.status === "success") {
        setFlag("");
        setIsSolved(true);
        toast.success(data.data.message, {
          autoClose: 2500,
        });
      } else {
        toast.error(data.data.message, {
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Entered Flag is not correct, Please try again", {
        autoClose: 1000,
      });
      setLoading(false);
      console.error(error);
    }
  };
  // console.log(isUserLoggedIn.current.data.user._id);
  // console.log(object.users);
  return (
    <div className="flagBox">
      {object && object.users.includes(isUserLoggedIn.current.data.user._id) ? (
        <h3>You Solved this</h3>
      ) : (
        ""
      )}
      <h2>{object ? object.heading : ""}</h2>
      <div>Discription: {object ? object.description : ""}</div>
      <div>Link: {object ? object.link : ""}</div>
      <div>
        Author:{object ? object.host.name : ""}
        {object ? (
          <div className="author-photo">
            <img src={object.host.photo} />
          </div>
        ) : (
          ""
        )}
      </div>
      <div>Hint: {object && object.hint ? object.hint : "NO HINTS"}</div>
      <TextField
        id="filled-multiline-static"
        label="Flag you inserted in CTF"
        multiline
        variant="filled"
        value={flag}
        className="discussion-question-input"
        onChange={(e) => {
          setFlag(e.target.value);
        }}
      />
      <button onClick={submitFlag}>
        {!loading ? "Submit Flag Id" : <BeatLoader color="#fff" />}
      </button>

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
        theme="light"
      />
    </div>
  );
};

export default FlagCard;
