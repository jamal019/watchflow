import "./FilmCard.css";

const FilmCard = ({ movie, onClick }) => {
  return (
    <div className="film-card" id={movie.id} onClick={onClick}>
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
