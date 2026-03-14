import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import IndividualCards from './pages/IndividualCards';
import VideoCards from './pages/VideoCards';
import FamilyPacks from './pages/FamilyPacks';
import CardCustomizePage from './pages/CardCustomizePage';
import VideoCardCustomizePage from './pages/VideoCardCustomizePage';
import FamilyPackCustomizePage from './pages/FamilyPackCustomizePage';
// ✅ IMPORT these pages
import VerifyPayment from './pages/VerifyPayment';
import Download from './pages/Download';

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/individual" element={<IndividualCards />} />
                <Route path="/video" element={<VideoCards />} />
                <Route path="/family" element={<FamilyPacks />} />
                <Route path="/card/:cardId" element={<CardCustomizePage />} />
                <Route path="/video-card/:cardId" element={<VideoCardCustomizePage />} />
                <Route path="/family-pack/:packId" element={<FamilyPackCustomizePage />} />
                {/* ✅ ADD these routes */}
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