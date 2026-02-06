import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'; // Login Page
import List from './pages/List.jsx'; // List Page
import Details from './pages/Details.jsx';
import Register from './pages/Register.jsx';
import './css/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ang default page (Login) */}
        <Route path="/" element={<App />} />
        
        {/* Ang Register page */}
        <Route path="/register" element={<Register />} />
        
        {/* DITO ANG FIX: Idagdag ang route para sa List */}
        <Route path="/list" element={<List />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);