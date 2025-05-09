import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';  // Add your custom styles here
import GJLandingPage from './pages/gj-landing-page/GJLandingPage';  // Make sure this path is correct
import GJFeedPage from './pages/gj-feed-page/GJFeedPage';


const App = () => {

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes */}
          <Route path="/" element={<GJLandingPage />} />
          <Route path="/GJFeedPage" element={<GJFeedPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
