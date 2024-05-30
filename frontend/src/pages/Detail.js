// src/pages/Detail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import parasite from '../assets/parasite.jpg';
import traintobusan from '../assets/traintobusan.jpg';
import './Detail.css';

const Detail = () => {
  const { id } = useParams();
  const movies = [
    { id: 1, title: 'Train to Busan', image: traintobusan, description: 'A zombie outbreak in South Korea.' },
    { id: 2, title: 'Parasite', image: parasite, description: 'A dark comedy about class disparity.' },
  ];
  const movie = movies.find((m) => m.id === parseInt(id));

  return (
    <div className="detail">
      <img src={movie.image} alt={movie.title} />
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
    </div>
  );
};

export default Detail;
