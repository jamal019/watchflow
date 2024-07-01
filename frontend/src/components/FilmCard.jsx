import "./FilmCard.css";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { useEffect } from "react";
import defaultPoster from "../assets/default-movie.png";

const FilmCard = ({ movie, onClick, onSwipe }) => {
  const motionValue = useMotionValue(0);
  const rotateValue = useTransform(motionValue, [-300, 300], [-20, 20]);
  const opacityValue = useTransform(
    motionValue,
    [-200, -150, 0, 150, 200],
    [0.2, 1, 1, 1, 0.2]
  );
  const animControls = useAnimation();

  useEffect(() => {
    const swipe = motionValue.on("change", (filmPos) => {
      if (filmPos < -50) {
        document.body.classList.add("liked-movie");
        document.body.classList.remove("disliked-movie");
      } else if (filmPos > 50) {
        document.body.classList.add("disliked-movie");
        document.body.classList.remove("liked-movie");
      } else {
        document.body.classList.remove("liked-movie", "disliked-movie");
      }
    });
    return swipe;
  }, [motionValue]);

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) < 150) {
      animControls.start({ x: 0 }).then(() => {
        document.body.classList.remove("liked-movie", "disliked-movie");
      });
    } else {
      animControls.start({ x: info.point.x < 0 ? -300 : 300 }).then(() => {
        onSwipe(info.point.x < 0 ? "left" : "right", movie);
        document.body.classList.remove("liked-movie", "disliked-movie");
      });
    }
    console.log(document.querySelectorAll(".film-card").length);
    if (document.querySelectorAll(".film-card").length <= 1) {
      document.querySelector(".swiped-left-movies").classList.add("reveal");
    }
  };

  const handleImageError = (event) => {
    event.target.src = defaultPoster;
  };

  return (
    <motion.div
      className="film-card"
      id={movie.id}
      onClick={onClick}
      drag="x"
      style={{ x: motionValue, rotate: rotateValue, opacity: opacityValue }}
      dragConstraints={{ left: -1000, right: 1000 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
    >
      <div className="filmposter-wrapper">
        <img
          onError={handleImageError}
          className="filmposter"
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt="filmposter"
          onDragStart={(e) => e.preventDefault()} // Prevent default drag behavior
        />
      </div>
      <div className="film-infos">
        <h2 className="dark">{movie.title}</h2>
        <p className="dark">{movie.release_date.split("-")[0]}</p>
      </div>
    </motion.div>
  );
};

export default FilmCard;
