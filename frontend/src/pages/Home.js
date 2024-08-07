import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SwipeComponent from "../components/SwipeComponent";
import Intro from "../components/Intro";
import { auth } from "../firebase";

const Home = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");
    if (loggedIn && storedUsername) {
      setShowIntro(false);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setShowIntro(false);
    setUsername(username);
  };

  return (
    <div className="home">
      <h1 id="logo">WatchFlow</h1>
      {showIntro ? (
        <>
          <Intro onLogin={handleLogin} />
        </>
      ) : (
        <>
          <SwipeComponent username={username} />
        </>
      )}
    </div>
  );
};

export default Home;
