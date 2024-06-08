// src/components/SwipeComponent.js
import React, { useState, useEffect, useMemo } from "react";
//import { useNavigate } from "react-router-dom";
//import parasite from "../assets/parasite.jpg";
//import traintobusan from "../assets/traintobusan.jpg";
import "./SwipeComponent.css";
import FilmCard from "./FilmCard";

const SwipeComponent = () => {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  //const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
  const options = useMemo(
    () => ({
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTU5ODNkMTc1ZTRiMzcxMTk5Y2Q2ZWExOWJkOTUyYyIsInN1YiI6IjY2NWIzYWRkNzg1NGEwZjkxNzEwMzg4MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IewKDj8gP21xbX0UBlFU6KIHSSGCzdJyjWeDe74H3BM",
      },
    }),
    []
  );

  //const [currentIndex, setCurrentIndex] = useState(0);
  //const navigate = useNavigate();
  // const movies = [
  //   { id: 1, title: "Train to Busan", image: traintobusan },
  //   { id: 2, title: "Parasite", image: parasite },
  // ];
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&page=1`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.results) {
          setMovies(data.results);
        }
        console.log(data);
      });
  }, [TMDB_API_KEY, options]);

  return (
    <section className="swipe-page">
      <div className="swipe-thumbs">
        <span>👍🏼</span>
        <span>👎🏼</span>
      </div>

      <div className="swipe-component">
        {movies.length > 0 ? (
          movies.map((movie) => <FilmCard key={movie.id} movie={movie} />)
        ) : (
          <p>Loading movies...</p>
        )}
      </div>
    </section>
  );
};

export default SwipeComponent;
