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
    const q = query(partiesCollection, where(`participants.${user.uid}`, "!=", null));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const partyList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
      <div className="party-list">
        {watchParties.map((party) => (
          <div key={party.id} className="party-item">
            <Link to={`/watchparty/${party.id}`}>
              <h2>{party.name}</h2>
              <p>{formatDate(party.date)} um {party.time}</p>
              <p>{party.movieTitle}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchParty;
