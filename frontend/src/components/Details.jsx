import React, { useEffect, useState, useMemo } from "react";
import "./Details.css";

const Details = ({ movieId }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options)
      .then((response) => response.json())
      .then((data) => {
        setMovieDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        setError(error);
        setLoading(false);
      });
       // Fetch movie trailers
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos`, options)
    .then((response) => response.json())
    .then((data) => {
      const trailers = data.results.filter(video => video.site === "YouTube" && video.type === "Trailer");
      if (trailers.length > 0) {
        setTrailerKey(trailers[0].key);
      }
    })
    .catch((error) => {
      console.error("Error fetching movie trailers:", error);
      setError(error);
    });
  }, [movieId, options]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading movie details.</div>;
  }

  return (
    <section className="details-page">
      {movieDetails && (
        <>
          {trailerKey ? (
            <div className="modal-details-video-container">
            <iframe
              className="modal-details-video"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="YouTube video player"
              autoPlay="1"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            </div>
          ) : (
            <img
              className="modal-details-img"
              src={"https://image.tmdb.org/t/p/w500/" + movieDetails.poster_path}
              alt=""
            />
          )}
          <div className="modal-details-text">
            <h2>{movieDetails.title}</h2>
            <div className="genres">
            {
              movieDetails.genres.map((genre) => {
               return <p><strong>{genre.name}</strong></p>
              })
            }
            </div>
            <br/>
            <p>{movieDetails.release_date.split("-")[0]}</p>
            <br />
            <p>{movieDetails.overview}</p>
            {/* <p>Rating: {movieDetails.vote_average}</p> */}
            <div style={{ height: "25vh" }}></div>
          </div>
        </>
      )}
    </section>
  );
};

export default Details;
