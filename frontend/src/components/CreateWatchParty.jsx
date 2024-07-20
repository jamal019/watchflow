import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import "./CreateWatchParty.css";

const CreateWatchParty = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [partyName, setPartyName] = useState("");
  const [partyDate, setPartyDate] = useState("");
  const [partyTime, setPartyTime] = useState("");
  const [error, setError] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [provider, setProvider] = useState(null);

  const TMDB_API_TOKEN = process.env.REACT_APP_TMDB_TOKEN;

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMovieDetails(data);
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const trailers = data.results.filter(video => video.site === "YouTube" && video.type === "Trailer");
            if (trailers.length > 0) {
              setTrailerKey(trailers[0].key);
            }
          });

        fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const res = data.results["DE"];
            if (res) {
              setProvider(res);
            }
          });
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        setError(error);
      });
  }, [movieId, TMDB_API_TOKEN]);

  const handleCreateParty = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to create a watch party.");
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const username = userDoc.exists() ? userDoc.data().username : "Unknown User";

    const newParty = {
      name: partyName,
      date: partyDate,
      time: partyTime,
      movieId: movieId,
      movieTitle: movieDetails?.title || "Unknown Movie Title",
      movieOverview: movieDetails?.overview || "No overview available",
      trailerKey: trailerKey,
      provider: provider,
      moviePoster: movieDetails?.poster_path,
      participants: { [user.uid]: { username, role: "host" } }
    };

    try {
      const docRef = await addDoc(collection(db, "watchParties"), newParty);
      console.log("Watch party created successfully:", newParty);
      navigate(`/watchparty/${docRef.id}`); // Navigate to the newly created watch party's detail page
    } catch (error) {
      console.error("Error creating watch party:", error);
      setError(error);
    }
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
