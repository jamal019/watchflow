import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import "./WatchParty.css";

const WatchParty = () => {
  const { partyId } = useParams();
  const [watchParties, setWatchParties] = useState([]);
  const [partyDetails, setPartyDetails] = useState(null);
  const [newParty, setNewParty] = useState({ name: "", date: "", time: "", movieId: "", movieTitle: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const watchPartiesCollection = collection(db, "watchparties");

  const fetchWatchParties = async () => {
    setLoading(true);
    try {
      const data = await getDocs(watchPartiesCollection);
      setWatchParties(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleCreateParty = async () => {
    try {
      await addDoc(watchPartiesCollection, newParty);
      setNewParty({ name: "", date: "", time: "", movieId: "", movieTitle: "" });
      fetchWatchParties();
    } catch (error) {
      setError(error);
    }
  };

  const handleDeleteParty = async (id) => {
    try {
      await deleteDoc(doc(db, "watchparties", id));
      fetchWatchParties();
    } catch (error) {
      setError(error);
    }
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
      {loading && <p>Loading...</p>}
      {error && <p>Error loading watch parties: {error.message}</p>}
      <div className="create-party">
        <input
          type="text"
          placeholder="Party Name"
          value={newParty.name}
          onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
        />
        <input
          type="date"
          value={newParty.date}
          onChange={(e) => setNewParty({ ...newParty, date: e.target.value })}
        />
        <input
          type="time"
          value={newParty.time}
          onChange={(e) => setNewParty({ ...newParty, time: e.target.value })}
        />
        <input
          type="text"
          placeholder="Movie ID"
          value={newParty.movieId}
          onChange={(e) => setNewParty({ ...newParty, movieId: e.target.value })}
        />
        <input
          type="text"
          placeholder="Movie Title"
          value={newParty.movieTitle}
          onChange={(e) => setNewParty({ ...newParty, movieTitle: e.target.value })}
        />
        <button onClick={handleCreateParty}>Create Party</button>
      </div>
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
          <p>Participants: {partyDetails.participants}</p>
          {/* Add chat component and other details */}
        </div>
      )}
    </div>
  );
};

export default WatchParty;
