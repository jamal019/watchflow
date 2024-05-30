// src/components/SwipeComponent.js
import React, { useState } from 'react';

const SwipeComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const movies = [
    { id: 1, title: 'Train to Busan', image: '/images/traintobusan.jpg' },
    { id: 2, title: 'Parasite', image: '/images/parasite.jpg' },
  ];

  const handleSwipeLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handleSwipeRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  return (
    <div className="swipe-component">
      <div className="movie-card">
        <img src={movies[currentIndex].image} alt={movies[currentIndex].title} />
        <h2>{movies[currentIndex].title}</h2>
        <div className="buttons">
          <button onClick={handleSwipeLeft}>👎</button>
          <button onClick={handleSwipeRight}>👍</button>
        </div>
      </div>
    </div>
  );
};

export default SwipeComponent;
