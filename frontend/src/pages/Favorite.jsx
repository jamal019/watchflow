import React, { useState, useEffect } from "react";
import "./Favorite.css";
import Details from "../components/Details";
import { db, auth } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc, addDoc } from "firebase/firestore";
import queryString from 'query-string';

const Favorite = () => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (user) {
        const favoritesCollection = collection(db, "users", user.uid, "liked");
        const unsubscribe = onSnapshot(favoritesCollection, (snapshot) => {
          const updatedFavorites = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFavorites(updatedFavorites);
        });
        return () => unsubscribe();
      }
    };

    fetchFavorites();
  }, []);

  const handleDetailsClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const closeDetails = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedMovieId(null);
      setIsClosing(false);
    }, 500);
  };

  const handleDelete = async (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);

    const user = auth.currentUser;
    if (user) {
      const movieDoc = doc(db, "users", user.uid, "liked", id);
      await deleteDoc(movieDoc);
    }
  };

  const handleWatched = async (fav) => {
    const updatedFavorites = favorites.filter(f => f.id !== fav.id);
    setFavorites(updatedFavorites);

    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, "users", user.uid, "watched"), fav);
        const movieDoc = doc(db, "users", user.uid, "liked", fav.id);
        await deleteDoc(movieDoc);
      } catch (error) {
        console.error("Error moving movie to watched: ", error);
        setFavorites([...updatedFavorites, fav]);
      }
    }
  };

  const formatMovieList = (movies) => {
    return movies.map(movie => `${movie.name} (${movie.year})`).join('\n');
  };

  const shareOnWhatsApp = (movies) => {
    const movieList = formatMovieList(movies);
    const message = `Check out my favorite movies I'd like to watch:\n\n${movieList}`;
    const url = `https://api.whatsapp.com/send?${queryString.stringify({ text: message })}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="favoritesPage">
        <h1>Favorites</h1>
        <div className="favoritesWrap">
          {favorites.map((fav) => (
            <div key={fav.tmdbID} className="favoritesList">
              <div className="favoriteItem">
                <img
                  onClick={() => handleDetailsClick(fav.tmdbID)}
                  className="favoriteImg"
                  src={fav.image}
                  alt={fav.image}
                />
                <p className="favoriteName">{fav.name}, {fav.year}</p>
              </div>
              <div className="actions">
                <span onClick={() => handleWatched(fav)} className="watched">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="white" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                  </svg>
                </span>
                <span onClick={() => handleDelete(fav.id)} className="delete">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="white" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
        <br/> <br/>
        <button className="shareBtn" onClick={() => shareOnWhatsApp(favorites)}>Share on WhatsApp</button>
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

export default Favorite;
