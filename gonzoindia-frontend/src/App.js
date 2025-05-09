import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';  // Add your custom styles here
import GJLandingPage from './pages/gj-landing-page/GJLandingPage';  // Make sure this path is correct
import GJFeedPage from './pages/gj-feed-page/GJFeedPage';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {setUser} from './features/auth/authSlice'


const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const backendURL = process.env.REACT_APP_BACKEND_URL;
        console.log('Fetching user from:', backendURL);
        try {
          const res = await axios.get(`${backendURL}/auth/me`, {
            withCredentials: true,
          });
          console.log('User data received:', res.data);
          dispatch(setUser(res.data));
          return;
        } catch (authError) {
          console.log('Auth/me failed, trying fallback:', authError);
        }
        const res = await axios.get(`${backendURL}/me`, {
          withCredentials: true,
        });
        console.log('User data received from fallback:', res.data);
        dispatch(setUser(res.data));
      } catch (err) {
        console.error('User not logged in', err);
      }
    };

    fetchUser();
  }, [dispatch]);
  

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
