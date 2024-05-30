// src/components/SwipeComponent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import parasite from '../assets/parasite.jpg';
import traintobusan from '../assets/traintobusan.jpg';
import './SwipeComponent.css';

const SwipeComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const movies = [
    { id: 1, title: 'Train to Busan', image: traintobusan },
    { id: 2, title: 'Parasite', image: parasite },
  ];

  const handleSwipeLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handleSwipeRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handleDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className="swipe-component">
      <div className="movie-card" onClick={() => handleDetail(movies[currentIndex].id)}>
        <img src={movies[currentIndex].image} alt={movies[currentIndex].title} />
        <h2>{movies[currentIndex].title}</h2>
      </div>
      <div className="buttons">
        <button onClick={handleSwipeLeft}>👎</button>
        <button onClick={handleSwipeRight}>👍</button>
      </div>
    </div>
  );
};

export default SwipeComponent;