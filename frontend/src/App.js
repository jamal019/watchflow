// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorite from "./pages/Favorite";
import Watched from "./pages/Watched";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/watched" element={<Watched />} />
          {/* <Route path="/detail/:id" element={<Detail />} /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
