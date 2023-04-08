import React, { useState } from "react";
import { BrowserRouter, Route, Link, Router, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home/Home";
import Error from "./pages/Error/Error";
import Header from "./components/Header/Header";
import Discussion from "./pages/Discussion/Discussion";
import DiscussionChat from "./pages/DiscussionChat/DiscussionChat";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="discussion" element={<Discussion />} />
        <Route path="discussion/:slug" element={<DiscussionChat />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
