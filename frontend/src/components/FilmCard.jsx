import "./FilmCard.css";
import { useEffect, useRef } from "react";
import Hammer from "hammerjs";

const FilmCard = ({ movie }) => {
  const swipeRef = useRef(null);

  useEffect(() => {
    if (swipeRef.current) {
      const hammer = new Hammer(swipeRef.current);
      hammer.on("swipeleft", () => {
        alert("Swiped left!");
      });
      hammer.on("swiperight", () => {
        alert("Swiped right!");
      });
      return () => {
        hammer.off("swipeleft");
        hammer.off("swiperight");
      };
    }
  }, []);

  return (
    <div ref={swipeRef} className="film-card" id={movie.id}>
      <img
        className="filmposter"
        src={" https://image.tmdb.org/t/p/w500/" + movie.poster_path}
        alt="filmposter"
      />
      <div className="film-infos">
        <h2 className="dark">{movie.title}</h2>
        <p className="dark">{movie.release_date.split("-")[0]}</p>
      </div>
    </div>
  );
};

export default FilmCard;
