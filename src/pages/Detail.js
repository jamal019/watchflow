// src/pages/Detail.js
import React from 'react';
import { useParams } from 'react-router-dom';

const Detail = () => {
  const { id } = useParams();
  return (
    <div className="detail">
      <h1>Detailansicht für Film {id}</h1>
      {/* Weitere Details hier */}
    </div>
  );
};

export default Detail;
