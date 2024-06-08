import "./FilmCard.css";

const FilmCard = ({ movie }) => {
  return (
    <div className="film-card">
      <img
        className="filmposter"
        src={" https://image.tmdb.org/t/p/w500/" + movie.poster_path}
        alt="filmposter"
      />
      <div className="film-infos">
        <h2>{movie.title}</h2>
        <p>{movie.release_date}</p>
      </div>
    </div>
  );
};

export default FilmCard;
