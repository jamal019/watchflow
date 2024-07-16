import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./SwipeComponent.css";
import FilmCard from "./FilmCard";
import Details from "./Details";
import defaultPoster from "../assets/default-movie.png";
import swipeGif from "../assets/swipe.gif";
import { db } from "../firebase";
import { collection, /*addDoc*/ writeBatch, doc } from "firebase/firestore";

const SwipeComponent = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [swipedLeftMovies, setSwipedLeftMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API;
  const TMDB_API_TOKEN = process.env.REACT_APP_TMDB_TOKEN;

  //const moviesCollection = collection(db, "liked");

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
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });
  }, [TMDB_API_KEY, options]);

  const fetchSimilarMovies = useCallback(
    (movieId) => {
      setLoading(true);
      setShowLoader(true);
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
          setShowLoader(false);
        })
        .catch((error) => {
          console.error("Error fetching similar movies:", error);
          setLoading(false);
          setShowLoader(false);
        });
    },
    [TMDB_API_KEY, options]
  );

  useEffect(() => {
    const storedSwipedLeftMovies = loadSwipedLeftMoviesFromLocalStorage();
    if (storedSwipedLeftMovies.length > 0) {
      setSwipedLeftMovies(storedSwipedLeftMovies);
    }
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    saveSwipedLeftMoviesToLocalStorage(swipedLeftMovies);
  }, [swipedLeftMovies]);

  const handleDetailsClick = (movieId) => {
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

  const handleSwipe = async (direction, movie) => {
    if (direction === "left") {
      setSwipedLeftMovies((prevMovies) => [...prevMovies, movie]);
      try {
        const batch = writeBatch(db);
        const movieDocRef = doc(collection(db, "liked"));
        batch.set(movieDocRef, {
          name: movie.title,
          tmdbID: movie.id,
          year: new Date(movie.release_date).getFullYear(),
          image: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        });
        await batch.commit();
        console.log("Movie added to Firestore:", movie.title);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
    setTimeout(() => {
      document.body.classList.remove("liked-movie", "disliked-movie");
    }, 200);
    setMovies((prevMovies) => prevMovies.filter((m) => m.id !== movie.id));
  };

  const handleMovieImageClick = (movieId) => {
    fetchSimilarMovies(movieId);
    setSwipedLeftMovies([]);
  };

  const handleImageError = (event) => {
    event.target.src = defaultPoster;
  };

  const saveSwipedLeftMoviesToLocalStorage = (movies) => {
    localStorage.setItem("swipedLeftMovies", JSON.stringify(movies));
  };

  const loadSwipedLeftMoviesFromLocalStorage = () => {
    const movies = localStorage.getItem("swipedLeftMovies");
    return movies ? JSON.parse(movies) : [];
  };

  const addFadeOutClass = () => {
    const swipeLoader = document.getElementById("swipeloader");
    if (swipeLoader) {
      swipeLoader.classList.add("fadeOut");
    }
  };

  setTimeout(addFadeOutClass, 3000);

  return (
    <>
      <div id="swipeloader">
        <img src={swipeGif} alt="swipe gif" />
      </div>
      {showLoader && (
        <div id="swipeloader">
          <img src={swipeGif} alt="swipe gif" />
        </div>
      )}
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
                fetchMovies={fetchMovies}
              />
            ))
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
                  onClick={() => handleMovieImageClick(movie.id)}
                />
              </div>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default SwipeComponent;
