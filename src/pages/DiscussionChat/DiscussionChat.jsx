import { React, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md ";
import { BiUpvote, BiDownvote, BiComment } from "react-icons/bi";
import { BsThreeDotsVertical, BsShare, BsBookmark } from "react-icons/bs";
import { GoReport } from "react-icons/go";
import { RxCross1 } from "react-icons/rx";
import "./DiscussionChat.css";
import DiscussionAnswer from "../../components/DiscussionAnswer/DiscussionAnswer";
import ReportPopup from "../../components/ReportPopup/ReportPopup";
import TextField from "@mui/material/TextField";
import utkarsh from "../../assets/utkarsh.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Helmet } from "react-helmet";

const DiscussionChat = () => {
  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const [discussionData, setDiscussionData] = useState({});
  const [messages, setMessages] = useState([]);

  const [answer, setAnswer] = useState("");
  const [answercode, setAnswercode] = useState("");
  // update this
  const [up, setUp] = useState(0);
  const [down, setDown] = useState(0);
  // reportpopup
  const [report, setReport] = useState(false);

  const openPopup = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();

  const back = () => {
    navigate(-1);
  };

  const faltu = () => {
    console.log("");
  };

  const handleUpVote = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };

      const { data } = await axios.post(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/chat/vote/${discussionData._id}`,
        { vote: "up" },
        config
      );
      setUp(data.upvotes);
      setDown(data.downvotes);
      // console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownVote = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };

      const { data } = await axios.post(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/chat/vote/${discussionData._id}`,
        { vote: "down" },
        config
      );
      setDown(data.downvotes);
      setUp(data.upvotes);
      // console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  // console.log(slug);

  const pageLoad = async () => {
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
        `https://flagrush-backend-w1n5.onrender.com/api/v1/chat/slug`,
        { slug: slug },
        config
      );

      // console.log(data.chat[0]);
      setDiscussionData(data.chat[0]);
      setUp(data.chat[0].upvotes.length);
      setDown(data.chat[0].downvotes.length);

      const message = await axios.get(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/message/${data.chat[0]._id}`,

        config
      );
      // console.log(message.data);
      setMessages(message.data);
      //   console.log(data[1].content);
      //   setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async () => {
    if (answer === "") {
      toast.error("Enter Your Answer", {
        autoClose: 2000,
      });
    } else {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("userInfo")).token
            }`,
          },
        };
        toast.success("Answer submitted successfully", {
          autoClose: 2000,
        });
        const { data } = await axios.post(
          `https://flagrush-backend-w1n5.onrender.com/api/v1/message/`,
          { content: answer, code: answercode, chatId: discussionData._id },
          config
        );
        // console.log(data);
        setMessages([...messages, data]);
        // console.log(messages);
        setAnswer("");
        setAnswercode("");
        toast.success("Answer submitted successfully", {
          autoClose: 2000,
        });
        // console.log(data.chat[0]);
        // setDiscussionData(data.chat[0]);
      } catch (error) {
        console.log(error);
        toast.error("Enter Your Answer", {
          autoClose: 2000,
        });
      }
    }
  };

  useEffect(() => {
    pageLoad();
  }, []);

  return (
    <div className="discussion-chat-container">
      <Helmet>
        <title>FlagRush | Discussion Chat</title>
      </Helmet>

      <div className="discussion-header">
        <button className="back-button" onClick={back}>
          <MdArrowBackIos />
        </button>
        <h1>Discussion</h1>
      </div>

      {report && (
        <ReportPopup item={discussionData} onClose={() => setReport(false)} />
      )}

      {/* Main Discussion Content */}
      <div className="discussion-content">
        <h2 className="discussion-title">
          {discussionData.chatName || "Loading..."}
        </h2>

        {discussionData.discription && (
          <p className="discussion-description">{discussionData.discription}</p>
        )}

        {discussionData.code && (
          <div className="discussion-code-block">
            <pre>
              <code>{discussionData.code}</code>
            </pre>
          </div>
        )}

        {/* Discussion Actions */}
        <div className="discussion-actions">
          <div className="vote-section">
            <button
              className={`vote-button upvote ${up ? "active" : ""}`}
              onClick={handleUpVote}
            >
              <BiUpvote /> <span>{up}</span>
            </button>
            <button
              className={`vote-button downvote ${down ? "active" : ""}`}
              onClick={handleDownVote}
            >
              <BiDownvote /> <span>{down}</span>
            </button>
            <div className="comment-info">
              <BiComment />
              <span>{messages.length}</span>
              <div className="user-avatars">
                <img src={utkarsh} alt="User" />
                <img src={utkarsh} alt="User" />
                <img src={utkarsh} alt="User" />
              </div>
            </div>
          </div>

          <div className="dropdown-menu">
            <button className="dropdown-toggle" onClick={openPopup}>
              {open ? <RxCross1 /> : <BsThreeDotsVertical />}
            </button>
            {open && (
              <div className="dropdown-content">
                <div className="dropdown-item" onClick={faltu}>
                  <BsShare /> Share
                </div>
                <div className="dropdown-item" onClick={faltu}>
                  <BsBookmark /> Bookmark
                </div>
                <div className="dropdown-item" onClick={() => setReport(true)}>
                  <GoReport /> Report
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answer Form */}
      <div className="answer-form">
        <h3>Your Answer</h3>
        <TextField
          label="Write your answer"
          variant="outlined"
          multiline
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <TextField
          label="Add code here (optional)"
          variant="outlined"
          multiline
          rows={4}
          value={answercode}
          onChange={(e) => setAnswercode(e.target.value)}
        />
        <div className="form-actions">
          <button className="submit-button" onClick={handleClick}>
            Post Answer
          </button>
        </div>
      </div>

      {/* Answers List */}
      <div className="answers-list">
        {messages.length > 0 ? (
          messages.map((item) => (
            <DiscussionAnswer item={item} key={item._id} />
          ))
        ) : (
          <p>No answers yet. Be the first to respond!</p>
        )}
      </div>
      {/* 
      <ToastContainer
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
  );
};

export default DiscussionChat;
