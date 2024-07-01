// src/pages/Home.js
import React, { useState, useEffect } from "react";
import SwipeComponent from "../components/SwipeComponent";
import Intro from "../components/Intro";

const Home = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn) {
      setShowIntro(false);
    }
  }, []);

  const handleLogin = () => {
    setShowIntro(false);
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
          <SwipeComponent />
        </>
      )}
    </div>
  );
};

export default Home;
