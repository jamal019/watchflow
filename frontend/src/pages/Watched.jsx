import React, { useState, useEffect } from "react";
import "./Favorite.css";
import Details from "../components/Details";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import queryString from 'query-string';

const Watched = () => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [watched, setWatched] = useState([]);

  // Function to subscribe to Firestore for real-time updates
  useEffect(() => {
    const watchedCollection = collection(db, "watched");
    const unsubscribe = onSnapshot(watchedCollection, (snapshot) => {
      const updatedWatched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWatched(updatedWatched);
    });

    return () => unsubscribe();
  }, []);

  // Function to handle movie details click
  const handleDetailsClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  // Function to close details modal
  const closeDetails = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedMovieId(null);
      setIsClosing(false);
    }, 500);
  };

  // Function to format movie list for sharing
  const formatMovieList = (movies) => {
    return movies.map(movie => `${movie.name} (${movie.year})`).join('\n');
  };

  // Function to share the movie list on WhatsApp
  const shareOnWhatsApp = (movies) => {
    const movieList = formatMovieList(movies);
    const message = `Check out the movies I watched:\n\n${movieList}`;
    const url = `https://api.whatsapp.com/send?${queryString.stringify({ text: message })}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="favoritesPage">
        <h1>Watched</h1>
        <div className="favoritesWrap">
          {watched.map((fav) => (
            <div key={fav.id} className="favoritesList">
              <div className="favoriteItem">
                <img
                  onClick={() => handleDetailsClick(fav.tmdbID)}
                  className="favoriteImg"
                  src={fav.image}
                  alt={fav.image}
                />
                <p className="favoriteName">{fav.name}, {fav.year}</p>
              </div>
            </div>
          ))}
        </div>
        <br/> <br/>
        <button className="shareBtn" onClick={() => shareOnWhatsApp(watched)}>Share on WhatsApp</button>
      </div>

      {selectedMovieId && (
        <div className={`modal-details ${isClosing ? "hide" : ""}`} onClick={closeDetails}>
          <div className="modal-details-content" onClick={(e) => e.stopPropagation()}>
            <p className="close-details" onClick={closeDetails}>
              &times;
            </p>
            <Details movieId={selectedMovieId} />
          </div>
        </div>
      )}
    </>
  );
};

export default Watched;
