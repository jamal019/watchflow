import React from "react";
import applogo from '../assets/applogo.png';

function start() {
  let introScreen = document.querySelector("#intro");
  let nameLogin = document.getElementById("name");
  let pwLogin = document.getElementById("password");
  if (nameLogin.value !== "" && nameLogin.value === "demo" && pwLogin !== "" && pwLogin.value === "demo") {
    introScreen.classList.add("fadeOut");
    setTimeout(() => { introScreen.style.display = "none" }, 1000);
  }
  else {
    alert("Failed Login");
  }
}

const Intro = () => {
  return (
    <div>
      <img id="applogo" src={applogo} alt="logo" />
      <h1>WatchFlow</h1>
      <br />
      <div className="login">
        <input id="name" type="text" placeholder="demo" />
        <input id="password" type="password" placeholder="demo" />
        <button onClick={start}>LOGIN</button>
      </div>
    </div>
  );
};

export default Intro;
