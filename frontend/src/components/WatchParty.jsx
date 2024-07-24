import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import "./WatchParty.css";

const WatchParty = () => {
  const [watchParties, setWatchParties] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      // Benutzer ist nicht eingeloggt
      return;
    }

    const partiesCollection = collection(db, "watchParties");
    const q = query(
      partiesCollection,
      where(`participants.${user.uid}`, "!=", null)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const partyList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWatchParties(partyList);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("de-DE", options);
  };

  return (
    <div className="watchparty-page">
      <h1>My WatchParties</h1>
      <svg style={{maxWidth: "55px"}} className="header-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path
          fill="white"
          d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z"
        ></path>
      </svg>
      <div className="party-list">
        {watchParties.map((party) => (
          <div key={party.id} className="party-item">
            <div className="party-link-container">
              <Link to={`/watchparty/${party.id}`} className="party-link">
                <img
                  className="party-img"
                  src={`https://image.tmdb.org/t/p/w500${party.moviePoster}`}
                  alt={party.movieTitle}
                />
                <div>
                  <h2>{party.name}</h2>
                  <p>
                    {formatDate(party.date)} at {party.time}
                  </p>
                  <p>{party.movieTitle}</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchParty;
