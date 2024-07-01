// src/components/Intro.js
import React, { useState, useEffect } from "react";
import applogo from '../assets/applogo.png';

const Intro = ({ onLogin }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn) {
      setIsLoggedIn(true);
      onLogin();
    }
  }, [onLogin]);

  const start = () => {
    let nameLogin = document.getElementById("name").value;
    let pwLogin = document.getElementById("password").value;
    if (nameLogin === "demo" && pwLogin === "demo") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      onLogin();
    } else {
      alert("Failed Login");
    }
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <div id="intro">
      <div>
        <img id="applogo" src={applogo} alt="logo" />
        <h1>WatchFlow</h1>
        <br />
        <div className="login">
          <input id="name" type="text" placeholder="demo" />
          <input id="password" type="password" placeholder="demo" />
          <button onClick={start}>LOGIN</button>
        </div>
      </div>
    </div>
  );
};

export default Intro;
