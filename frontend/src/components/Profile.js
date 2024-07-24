import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("username");
      localStorage.removeItem("isLoggedIn");
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="profile">
      <h1>Profile</h1>
      <svg className="header-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path
          fill="white"
          d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
        ></path>
      </svg>
      <h2>Nice to have you here, {username}</h2>
      <div className="profile-buttons">
        <button className="profile-button">Account Settings</button>
        <button className="profile-button">Privacy Settings</button>
        <button className="profile-button">Notification Settings</button>
        <button className="profile-button">Subscription Details</button>
        <button className="profile-button">Help & Support</button>
        <button className="profile-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
