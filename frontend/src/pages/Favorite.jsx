// src/pages/Favorite.js
import React from "react";
import { useState, useEffect } from "react";
import {db} from "../firebase";
import {collection,getDocs} from "firebase/firestore";

import "./Favorite.css";
import Details from "../components/Details";

const Favorite = () => {

  const [selectedMovieId,setSelectedMovieId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const [favorites,setFavorites] = useState();

  const favoritesCollection = collection(db,"liked");

  const getFavorites = async () => {
    const data = await getDocs(favoritesCollection);
    setFavorites(data.docs.map((val) => ({...val.data(), id:val.id})));
  }

  useEffect(() => {
    getFavorites();
  });

  const handleDetailsClick = (movieId) => {
    //console.log("Card clicked: ", movieId);
    setSelectedMovieId(movieId);
    document.querySelector("body").classList.add("no-scroll");
  };

  const closeDetails = () => {
    document.querySelector("body").classList.remove("no-scroll");
    setIsClosing(true);
    setTimeout(() => {
      setSelectedMovieId(null);
      setIsClosing(false);
    }, 500);
  };

  return (
    <>
    <div className="favoritesPage">
      <h1>Favorites</h1>
      {favorites && favorites.map((fav) => {
        return(
          <div id={fav.tmdbID} key={fav.tmdbID} className="favoritesList">
            <div className="favoriteItem">
              <img onClick={() => handleDetailsClick(fav.tmdbID)} className="favoriteImg" src={fav.image} alt={fav.image}/>
              <p className="favoriteName">{fav.name}, {fav.year}</p>
            </div>
          </div>          
        )
      })}
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
