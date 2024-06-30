import React from "react";
import applogo from '../assets/applogo.png';

function start() {
  let introScreen = document.querySelector("#intro");
  introScreen.classList.add("fadeOut");
  setTimeout(() => { introScreen.style.display = "none" }, 1000);
}

const Intro = () => {
  return (
    <div>
      <img id="applogo" src={applogo} alt="logo" />
      <h1>WatchFlow</h1>
      <br />
      <div className="login">
        <input type="text" placeholder="Name" />
        <input type="password" placeholder="Password" />
        <button onClick={start}>LOGIN</button>
      </div>
    </div>
  );
};

export default Intro;
