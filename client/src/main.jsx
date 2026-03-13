import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initGA } from './utils/analytics';

// Initialize Google Analytics with Measurement ID from .env
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (measurementId) {
  initGA(measurementId);
  console.log('📊 Google Analytics initialized with ID:', measurementId);
} else {
  console.warn('⚠️ Google Analytics Measurement ID not found in .env');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);