import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Favorite from "./pages/Favorite";
import Watched from "./pages/Watched";
import Footer from "./components/Footer";
import WatchParty from "./components/WatchParty";
import Profile from "./components/Profile";
import CreateWatchParty from "./components/CreateWatchParty";
import WatchPartyDetails from "./components/WatchPartyDetails";  
import InviteHandler from "./components/InviteHandler";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

const App = () => {
  const [activePage, setActivePage] = useState("/");
  const [user] = useAuthState(auth);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<ProtectedRoute user={user}><Favorite /></ProtectedRoute>} />
          <Route path="/watched" element={<ProtectedRoute user={user}><Watched /></ProtectedRoute>} />
          <Route path="/watchparty" element={<ProtectedRoute user={user}><WatchParty /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
          <Route path="/create-watchparty/:movieId" element={<ProtectedRoute user={user}><CreateWatchParty /></ProtectedRoute>} /> 
          <Route path="/watchparty/:partyId" element={<ProtectedRoute user={user}><WatchPartyDetails /></ProtectedRoute>} />
          <Route path="/watchparty/:partyId/invite" element={<InviteHandler />} />
        </Routes>
        {user && <Footer activePage={activePage} onPageChange={handlePageChange} />}
      </div>
    </Router>
  );
};

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/" />;
};

export default App;
