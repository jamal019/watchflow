import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./SwipeComponent.css";
import FilmCard from "./FilmCard";
import Details from "./Details";

import defaultPoster from "../assets/default-movie.png";

const SwipeComponent = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [swipedLeftMovies, setSwipedLeftMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API;
  const TMDB_API_TOKEN = process.env.REACT_APP_TMDB_TOKEN;

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

  const fetchMovies = useCallback(() => {
    setLoading(true);
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
        setLoading(false);
        console.log(data, randNum);
      });
  }, [TMDB_API_KEY, options]);

  const fetchSimilarMovies = useCallback((movieId) => {
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.results) {
          setMovies(data.results);
        }
        setLoading(false);
      });
  }, [TMDB_API_KEY, options]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleDetailsClick = (movieId) => {
    console.log("Card clicked: ", movieId);
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

  const handleSwipe = (direction, movie) => {
    if (direction === "left") {
      setSwipedLeftMovies((prevMovies) => [...prevMovies, movie]);
    }
    setTimeout(() => {
      document.body.classList.remove("liked-movie", "disliked-movie");
    }, 200);
    setMovies((prevMovies) => prevMovies.filter((m) => m.id !== movie.id));
  };

  const handleMovieImageClick = (movieId) => {
    fetchSimilarMovies(movieId);
    setSwipedLeftMovies([]); // Clear swiped left movies for new round
  };

  const handleImageError = (event) => {
    event.target.src = defaultPoster;
  };

  return (
    <>
      <section className="swipe-page">
        <div className="swipe-thumbs">
          <span>👍🏼</span>
          <span>👎🏼</span>
        </div>
        <div className="swipe-component">
          {loading ? (
            <p>Loading movies...</p>
          ) : (
            movies.map((movie) => (
              <FilmCard
                key={movie.id}
                movie={movie}
                onClick={() => handleDetailsClick(movie.id)}
                onSwipe={handleSwipe}
              />
            ))
          )}
        </div>
      </section>
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
      {swipedLeftMovies.length > 0 && (
        <section className="swiped-left-movies">
          <h2>NEW SWIPE ROUND?</h2>
          <h3>Select one below to swipe similar movies</h3>
          <ul>
            {swipedLeftMovies.map((movie) => (
              <div key={movie.id}>
                <img
                  onError={handleImageError}
                  className="swiped-left-movies-img"
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.id}
                  onClick={() => handleMovieImageClick(movie.id)} // Add click handler
                />
                {/* <li>{movie.title}</li> */}
              </div>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default SwipeComponent;
