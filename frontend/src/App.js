import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorite from "./pages/Favorite";
import Watched from "./pages/Watched";
import Footer from "./components/Footer";
import WatchParty from "./components/WatchParty";
import Profile from "./components/Profile";
import CreateWatchParty from "./components/CreateWatchParty";
import WatchPartyDetails from "./components/WatchPartyDetails";  

const App = () => {
  const [activePage, setActivePage] = useState("/");

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/watched" element={<Watched />} />
          <Route path="/watchparty" element={<WatchParty />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-watchparty/:movieId" element={<CreateWatchParty />} /> 
          <Route path="/watchparty/:partyId" element={<WatchPartyDetails />} />

          {/* <Route path="/detail/:id" element={<Detail />} /> */}
        </Routes>
        <Footer activePage={activePage} onPageChange={handlePageChange} />
      </div>
    </Router>
  );
};

export default App;