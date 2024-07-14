import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./WatchParty.css";

const WatchParty = () => {
  const { partyId } = useParams();
  const [watchParties, setWatchParties] = useState([]);
  const [partyDetails, setPartyDetails] = useState(null);

  const fetchWatchParties = () => {
    const parties = JSON.parse(localStorage.getItem("watchParties")) || [];
    setWatchParties(parties);
  };

  const handleDeleteParty = (id) => {
    const parties = JSON.parse(localStorage.getItem("watchParties")) || [];
    const updatedParties = parties.filter((party) => party.id !== id);
    localStorage.setItem("watchParties", JSON.stringify(updatedParties));
    fetchWatchParties();
  };

  const handleJoinParty = (party) => {
    setPartyDetails(party);
  };

  useEffect(() => {
    fetchWatchParties();
  }, []);

  return (
    <div className="watchparty-page">
      <h1>WatchParties</h1>
      <div className="party-list">
        {watchParties.map((party) => (
          <div key={party.id} className="party-item">
            <h2>{party.name}</h2>
            <p>{party.date} at {party.time}</p>
            <p>{party.movieTitle}</p>
            <button onClick={() => handleJoinParty(party)}>Join Party</button>
            <button onClick={() => handleDeleteParty(party.id)}>Delete</button>
          </div>
        ))}
      </div>
      {partyDetails && (
        <div className="party-details">
          <h2>{partyDetails.name}</h2>
          <p>{partyDetails.date} at {partyDetails.time}</p>
          <p>Movie: {partyDetails.movieTitle}</p>
          <p>Participants: {partyDetails.participants ? partyDetails.participants.join(", ") : "None"}</p>
          {/* Add chat component and other details */}
        </div>
      )}
    </div>
  );
};

export default WatchParty;
