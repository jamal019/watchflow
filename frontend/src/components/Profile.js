import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('username');
      localStorage.removeItem('isLoggedIn');
      navigate('/');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <div className="profile">
      <h1>Profile</h1>
      <h2>Nice to have you here, {username}</h2>
      <div className="profile-buttons">
        <button className="profile-button">
          Account Settings
        </button>
        <button className="profile-button">
          Privacy Settings
        </button>
        <button className="profile-button">
          Notification Settings
        </button>
        <button className="profile-button">
          Subscription Details
        </button>
        <button className="profile-button">
          Help & Support
        </button>
        <button className="profile-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
