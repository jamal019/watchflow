import React, { useEffect, useState, useMemo } from "react";
import "./Details.css";
import { Link } from "react-router-dom";

const Details = ({ movieId }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [provider, setProvider] = useState(null);
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
    // Fetch movie providers
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, options)
    .then((response) => response.json())
    .then((data) => {
      const res = data.results["DE"];
      if(res){
        setProvider(res);
      }
    })
    .catch((error) => {
      console.error("Error fetching movie providers:", error);
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
               return <p key={genre.id}><strong>{genre.name}</strong></p>
              })
            }
            </div>
            <br/>
            <p>{movieDetails.release_date.split("-")[0]}</p>
            <br />
            <p>{movieDetails.overview}</p>
            <br />
            <h3>Where to watch</h3>
            <div className="providers">
              {provider && provider.flatrate && provider.flatrate.length > 0 ? (
              <>
            <ul>
              {provider.flatrate.map((prov) => (
                <li key={prov.provider_id}>
                  <a target="_blank" href={provider.link} rel="noreferrer">
                  <img
                  src={`https://image.tmdb.org/t/p/w45${prov.logo_path}`}
                  alt={prov.provider_name}
                  />
                  </a>
                </li>
              ))}
            </ul>
            </>
          ) : (
            <p>No providers available</p>
          )}
          </div>
          <div className="create-watchparty">
              <Link to={`/create-watchparty/${movieId}`}>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="white" d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z"/></svg>
                  Create WatchParty
                </button>
              </Link>
            </div>
            <div style={{ height: "25vh" }}></div>
          </div>
        </>
      )}
    </section>
  );
};

export default Details;
