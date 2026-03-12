import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initGA } from './utils/analytics';

// Initialize Google Analytics with your Measurement ID
initGA('G-XXXXXXXXXX'); // Replace with your actual GA4 ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);