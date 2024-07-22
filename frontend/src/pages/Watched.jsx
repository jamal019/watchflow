import React, { useState, useEffect } from "react";
import "./Favorite.css";
import Details from "../components/Details";
//import { db } from "../firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import queryString from 'query-string';

import { db, auth } from "../firebase";


const Watched = () => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [watched, setWatched] = useState([]);

  // Function to subscribe to Firestore for real-time updates
  useEffect(() => {
    const fetchWatched = async () => {
      const user = auth.currentUser;
      if (user) {
        const watchedCollection = collection(db, "users", user.uid, "watched");
        const unsubscribe = onSnapshot(watchedCollection, (snapshot) => {
          const updatedWatched = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setWatched(updatedWatched);
        });
        return () => unsubscribe();
      }
    };

    fetchWatched();
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

  const handleDelete = async (id) => {
    const updatedWatched = watched.filter(fav => fav.id !== id);
    setWatched(updatedWatched);

    const user = auth.currentUser;
    if (user) {
      const movieDoc = doc(db, "users", user.uid, "watched", id);
      await deleteDoc(movieDoc);
    }
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
        <br/>
        <button className="shareBtn" onClick={() => shareOnWhatsApp(watched)}>Share</button>
        <div className="favoritesWrap">
          {watched.map((fav) => (
            <div key={fav.id} className="favoritesList">
              <div className="favoriteItem" onClick={() => handleDetailsClick(fav.tmdbID)}>
                <img
                  className="favoriteImg"
                  src={fav.image}
                  alt={fav.image}
                />
                <p className="favoriteName">{fav.name}, {fav.year}</p>
              </div>
              <div className="actions">
                <span onClick={() => handleDelete(fav.id)} className="delete">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="white" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
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
