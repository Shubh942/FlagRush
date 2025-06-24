import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlagCard from "../../components/FlagCard/FlagCard";
import "./Home.css";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "../../context/ChatProvider";
import { Helmet } from "react-helmet";
import Leaderboard from "../../components/Leaderboard/Leaderboard";

const Home = () => {
  const navigate = useNavigate();
  const { isUserLoggedIn } = ChatState();
  const [capture, setCapture] = useState([]);
  const [heading, setHeading] = useState("");
  const [loading, setLoading] = useState(false);
  const [discription, setDiscription] = useState("");
  const [hint, setHint] = useState("");
  const [flag, setFlag] = useState("");
  const [link, setLink] = useState("");

  const pageLoad = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      const { data } = await axios.get(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/ctf`,

        config
      );
      console.log(data.data);
      setCapture(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const objects = [
    {
      heading: "hsdfs",
      description: "sdfsdf",
      link: "sdfsdf",
      hint: "dsfsdfsd",
    },
    {
      heading: "hi",
      description: "sdfsdfsdfsdfsdf",
      link: "aaaa",
      hint: "345sdx",
    },
  ];

  const handleClick = async () => {
    if (!discription || !heading || !hint || !flag || !link) {
      toast.error("Enter all the fields", {
        autoClose: 1000,
      });
    } else {
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${isUserLoggedIn.current.token}`,
          },
        };
        console.log(isUserLoggedIn.current.token);
        const { data } = await axios.post(
          `https://flagrush-backend-w1n5.onrender.com/api/v1/ctf/createCtf`,
          {
            description: discription,
            heading,
            hint,
            flag,
            link,
          },
          config
        );
        toast.success("New CTF added", {
          autoClose: 1000,
        });
        // setNewDiscussion(data);
        setLoading(false);
        console.log(data);
        setCapture([...capture, data.data]);
        setDiscription("");
        setHeading("");
        setHint("");
        setFlag("");
        setLink("");
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.response.data.message, {
          autoClose: 1000,
        });
      }
    }
  };
  useEffect(() => {
    if (!isUserLoggedIn.current) {
      navigate("/login");
    }
    pageLoad();
  }, []);

  return (
    <div className="home-page">
      <div className="home-container">
        <Helmet>
          <title>FlagRush | Home</title>
        </Helmet>

        <main className="home-main">
          {/* CTF Creation Form */}
          <section className="ctf-form">
            <h2>Create New CTF Challenge</h2>
            <div className="form-grid">
              <div className="form-field">
                <TextField
                  label="Challenge Title"
                  variant="filled"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  fullWidth
                />
              </div>

              <div className="form-field">
                <TextField
                  label="Challenge Link"
                  variant="filled"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  fullWidth
                />
              </div>

              <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                <TextField
                  label="Description"
                  variant="filled"
                  multiline
                  rows={4}
                  value={discription}
                  onChange={(e) => setDiscription(e.target.value)}
                  fullWidth
                />
              </div>

              <div className="form-field">
                <TextField
                  label="Hint"
                  variant="filled"
                  multiline
                  rows={2}
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  fullWidth
                />
              </div>

              <div className="form-field">
                <TextField
                  label="Flag"
                  variant="filled"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  fullWidth
                />
              </div>

              <button
                className="btn-cta ctf-submit-btn"
                onClick={handleClick}
                disabled={loading}
              >
                {loading ? (
                  <BeatLoader color="#fff" size={10} />
                ) : (
                  "Create Challenge"
                )}
              </button>
            </div>
          </section>

          {/* CTF Challenges List */}
          <section className="ctf-list">
            <div className="ctf-list-header">
              <h2>Available CTF Challenges</h2>
            </div>

            {capture.length > 0 ? (
              <div className="ctf-grid">
                {capture.map((object) => (
                  <FlagCard key={object._id} object={object} />
                ))}
              </div>
            ) : (
              <div className="loading-spinner">
                <BeatLoader
                  color={getComputedStyle(
                    document.documentElement
                  ).getPropertyValue("--primary")}
                />
              </div>
            )}
          </section>
        </main>

        {/* Leaderboard Sidebar */}
        <aside className="sidebar">
          <Leaderboard />
        </aside>

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

export default Home;
