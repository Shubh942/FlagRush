import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlagCard from "../../components/FlagCard/FlagCard";
import './Home.css';
import { ChatState } from "../../context/ChatProvider";

const Home = () => {
  const { isUserLoggedIn } = ChatState();
  const navigate = useNavigate();

  const objects = [
    {
      heading: 'hsdfs',
      description: 'sdfsdf',
      link: 'sdfsdf',
      hint: 'dsfsdfsd'
    }, {
      heading: 'hi',
      description: 'sdfsdfsdfsdfsdf',
      link: 'aaaa',
      hint: '345sdx'
    }
  ]

  useEffect(() => {
    if (!isUserLoggedIn.current) {
      navigate("/login");
    }
  });

  return (
    <div>
      <h1>Community Page --</h1>
      <h3>All Flags are published here, you can try capturing them</h3>

      {objects.map((object) => (
        <div className="flag-flex"><FlagCard object={object} /></div>
      ))}
    </div>
  );
};

export default Home;
