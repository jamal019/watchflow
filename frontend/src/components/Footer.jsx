// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div>
        <Link to="/favorites">
          <span>Favorites</span>
        </Link>
        <Link to="/watched">
          <span>Watched</span>
        </Link>
        <Link to="/">
          <span>Swipe</span>
        </Link>
        <span>03</span>
        <span>04</span>
      </div>
    </footer>
  );
};

export default Footer;
