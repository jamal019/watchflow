import React, { useState, useEffect } from "react";
import applogo from '../assets/applogo.png';
import { registerWithEmailAndPassword, loginWithEmailAndPassword } from "../firebase";

const Intro = ({ onLogin }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");
    if (loggedIn && storedUsername) {
      setIsLoggedIn(true);
      onLogin(storedUsername);
    }
  }, [onLogin]);

  const handleLogin = async () => {
    if (email === "demo" && password === "demo") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", "Demo User");
      setIsLoggedIn(true);
      onLogin("Demo User");
      return;
    }

    try {
      const { username } = await loginWithEmailAndPassword(email, password);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      setIsLoggedIn(true);
      onLogin(username);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await registerWithEmailAndPassword(email, password, username);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      setIsLoggedIn(true);
      onLogin(username);
    } catch (error) {
      alert("Registration failed: " + error.message);
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
          {isRegister ? (
            <>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
              <button onClick={handleRegister}>REGISTER</button>
              <button onClick={() => setIsRegister(false)}>Go to Login</button>
            </>
          ) : (
            <>
              <input 
                type="text" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button onClick={handleLogin}>LOGIN</button>
              <button onClick={() => setIsRegister(true)}>Register</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Intro;
