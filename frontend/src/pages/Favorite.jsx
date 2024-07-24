import React, { useState, useEffect } from "react";
import "./Favorite.css";
import Details from "../components/Details";
import { db, auth } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc, addDoc } from "firebase/firestore";

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
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);

    const user = auth.currentUser;
    if (user) {
      const movieDoc = doc(db, "users", user.uid, "liked", id);
      await deleteDoc(movieDoc);
    }
  };

  const handleWatched = async (fav) => {
    const updatedFavorites = favorites.filter((f) => f.id !== fav.id);
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


  return (
    <>
      <div className="favoritesPage">
        <h1>Favorites</h1>
        <br />
        <div className="favoritesWrap">
          {favorites.length === 0 ? (
            <p style={{margin: "0 auto",textAlign:"center"}} className="noFavorites">No liked movies yet</p>
          ) : (
            favorites.map((fav) => (
              <div key={fav.tmdbID} className="favoritesList">
                <div className="favoriteItem" onClick={() => handleDetailsClick(fav.tmdbID)}>
                  <img
                    className="favoriteImg"
                    src={fav.image}
                    alt={fav.image}
                  />
                  <p className="favoriteName">
                    {fav.name}, {fav.year}
                  </p>
                </div>
                <div className="actions">
                  <span onClick={() => handleWatched(fav)} className="watched">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                      <path fill="white" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                    </svg>
                  </span>
                  <span onClick={() => handleDelete(fav.id)} className="delete">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path
                        fill="white"
                        d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedMovieId && (
        <div
          className={`modal-details ${isClosing ? "hide" : ""}`}
          onClick={closeDetails}
        >
          <div
            className="modal-details-content"
            onClick={(e) => e.stopPropagation()}
          >
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
