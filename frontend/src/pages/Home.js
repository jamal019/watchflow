// src/pages/Home.js
import React from "react";
import SwipeComponent from "../components/SwipeComponent";
//import Intro from "../components/Intro";

function start() {
  console.log("Start");
  document.querySelector("#intro").classList.add("fadeOut");
}

const Home = () => {
  return (
    <div className="home">
      <h1 id="logo">WatchFlow</h1>
      {/* <div id="intro" onClick={start}>
        <Intro />
      </div> */}
      <SwipeComponent />
    </div>
  );
};

export default Home;
