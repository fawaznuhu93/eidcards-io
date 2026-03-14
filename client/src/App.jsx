import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import IndividualCards from './pages/IndividualCards';
import VideoCards from './pages/VideoCards';
import FamilyPacks from './pages/FamilyPacks';
import CardCustomizePage from './pages/CardCustomizePage';
import VideoCardCustomizePage from './pages/VideoCardCustomizePage';
import FamilyPackCustomizePage from './pages/FamilyPackCustomizePage';
import VerifyPayment from './pages/VerifyPayment';
import Download from './pages/Download';
import { useEffect } from 'react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container-padding section-spacing">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/individual" element={<IndividualCards />} />
                <Route path="/video" element={<VideoCards />} />
                <Route path="/family" element={<FamilyPacks />} />
                <Route path="/card/:cardId" element={<CardCustomizePage />} />
                <Route path="/video-card/:cardId" element={<VideoCardCustomizePage />} />
                <Route path="/family-pack/:packId" element={<FamilyPackCustomizePage />} />
                <Route path="/verify" element={<VerifyPayment />} />
                <Route path="/download" element={<Download />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;