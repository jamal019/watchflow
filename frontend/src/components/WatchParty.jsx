import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./WatchParty.css";

const WatchParty = () => {
  const [watchParties, setWatchParties] = useState([]);

  const fetchWatchParties = () => {
    const parties = JSON.parse(localStorage.getItem("watchParties")) || [];
    setWatchParties(parties);
  };

  useEffect(() => {
    fetchWatchParties();
  }, []);

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("de-DE", options);
  };

  return (
    <div className="watchparty-page">
      <h1>My WatchParties</h1>
      <div className="party-list">
        {watchParties.map((party) => (
          <div key={party.id} className="party-item">
            <Link to={`/watchparty/${party.id}`}>
              <h2>{party.name}</h2>
              <p>{formatDate(party.date)} at {party.time}</p>
              <p>{party.movieTitle}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchParty;
