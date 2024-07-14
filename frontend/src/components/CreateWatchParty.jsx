import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateWatchParty.css";

const CreateWatchParty = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [partyName, setPartyName] = useState("");
  const [partyDate, setPartyDate] = useState("");
  const [partyTime, setPartyTime] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch movie title based on movieId (simulate fetching for now)
    const movies = JSON.parse(localStorage.getItem("movies")) || [];
    const movie = movies.find(m => m.id === movieId);
    setMovieTitle(movie ? movie.title : "Unknown Movie Title");
  }, [movieId]);

  const handleCreateParty = () => {
    const newParty = {
      id: Date.now().toString(),
      name: partyName,
      date: partyDate,
      time: partyTime,
      movieId: movieId,
      movieTitle: movieTitle
    };

    const parties = JSON.parse(localStorage.getItem("watchParties")) || [];
    parties.push(newParty);
    localStorage.setItem("watchParties", JSON.stringify(parties));
    setPartyName("");
    setPartyDate("");
    setPartyTime("");
    navigate("/watchparty");
  };

  return (
    <div className="create-watchparty-page">
      <h1>Create WatchParty</h1>
      {error && <p>Error creating watch party: {error.message}</p>}
      <div className="create-watchparty-form">
        <input
          type="text"
          placeholder="Party Name"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
        />
        <input
          type="date"
          value={partyDate}
          onChange={(e) => setPartyDate(e.target.value)}
        />
        <input
          type="time"
          value={partyTime}
          onChange={(e) => setPartyTime(e.target.value)}
        />
        <button onClick={handleCreateParty}>Create Party</button>
      </div>
    </div>
  );
};

export default CreateWatchParty;