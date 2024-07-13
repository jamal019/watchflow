import React from 'react';
import './Profile.css';

const Profile = () => {
  return (
    <div className="profile">
      <h1>Profile</h1>
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
        <button className="profile-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
