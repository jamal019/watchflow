// src/components/SwipeComponent.js
import React, { useState, useEffect, useMemo } from "react";
//import { useNavigate } from "react-router-dom";
//import parasite from "../assets/parasite.jpg";
//import traintobusan from "../assets/traintobusan.jpg";
import "./SwipeComponent.css";
import FilmCard from "./FilmCard";
import Details from "./Details";

const SwipeComponent = () => {
  //STATES
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  //API VARIABLES
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API;
  const TMDB_API_TOKEN = process.env.REACT_APP_TMDB_TOKEN;

  //API CALL OPTIONS
  const options = useMemo(
    () => ({
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
      },
    }),
    [TMDB_API_TOKEN]
  );

  //API CALL GET MOVIES
  useEffect(() => {
    const randNum = Math.floor(Math.random() * 99) + 1;
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&page=${randNum}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.results) {
          setMovies(data.results);
        }
        console.log(data, randNum);
      });
  }, [TMDB_API_KEY, options]);

  //SHOW/HIDE DETAILS
  const handleDetailsClick = (movieId) => {
    console.log("Card clicked: ", movieId);
    setSelectedMovieId(movieId);
    document.querySelector("body").classList.add("no-scroll");
  };

  const closeDetails = () => {
    document.querySelector("body").classList.remove("no-scroll");
    setIsClosing(true); // Start closing animation
    setTimeout(() => {
      setSelectedMovieId(null);
      setIsClosing(false); // Reset closing state
    }, 500);
  };

  const handleSwipe = (direction, movie) => {
    //const originCol = document.querySelector("body").style.backgroundColor;

    // if (direction === "left") {
    //   document.querySelector("body").classList.add("liked-movie");
    // } else if (direction === "right") {
    //   document.querySelector("body").classList.add("disliked-movie");
    // }
    setTimeout(() => {
      document.body.classList.remove("liked-movie", "disliked-movie");
    }, 200);

    console.log(`Swiped ${direction} on movie: ${movie.title}`);
    setMovies((prevMovies) => prevMovies.filter((m) => m.id !== movie.id));
  };

  return (
    <>
      <section className="swipe-page">
        <div className="swipe-thumbs">
          <span>👍🏼</span>
          <span>👎🏼</span>
        </div>

        <div className="swipe-component">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <FilmCard
                key={movie.id}
                movie={movie}
                onClick={() => handleDetailsClick(movie.id)}
                onSwipe={handleSwipe}
              />
            ))
          ) : (
            <p>Loading movies...</p>
          )}
        </div>
      </section>

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

export default SwipeComponent;
