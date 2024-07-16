import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./WatchPartyAdmin.css";

const WatchPartyAdmin = () => {
  const [watchParties, setWatchParties] = useState([]);

  const fetchWatchParties = async () => {
    try {
      const partiesCollection = collection(db, "watchParties");
      const partySnapshot = await getDocs(partiesCollection);
      const partyList = partySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWatchParties(partyList);
    } catch (error) {
      console.error("Error fetching watch parties: ", error);
    }
  };

  useEffect(() => {
    fetchWatchParties();
  }, []);

  const handleDeleteParty = async (partyId) => {
    try {
      const partyRef = doc(db, "watchParties", partyId);
      await deleteDoc(partyRef);
      console.log(`Deleted party with ID: ${partyId}`);
      fetchWatchParties(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting watch party: ", error);
    }
  };

  return (
    <div className="watchparty-admin-page">
      <h1>WatchParty Admin</h1>
      <div className="party-list">
        {watchParties.map((party) => (
          <div key={party.id} className="party-item">
            <h2>{party.name}</h2>
            <p>{new Date(party.date).toLocaleDateString("de-DE")} um {party.time}</p>
            <p>{party.movieTitle}</p>
            <button onClick={() => handleDeleteParty(party.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchPartyAdmin;
