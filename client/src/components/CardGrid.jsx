import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // ✅ Add this import
import { useLanguage } from '../contexts/LanguageContext';

export default function CardGrid({ cards }) {
  const { language } = useLanguage();
  const navigate = useNavigate(); // ✅ Add navigate hook

  const handleCustomize = (cardId) => {
    // Navigate to card customization page
    navigate(`/card/${cardId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group relative cursor-pointer"
          onClick={() => handleCustomize(card.id)} // ✅ Make whole card clickable
        >
          <div className="absolute inset-0 bg-gold-gradient rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
          
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gold/20">
            <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-gold/20 relative">
              {/* Placeholder for card image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">🌙</span>
              </div>
              
              {/* Preview overlay - Make button work */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering parent click
                    handleCustomize(card.id);
                  }}
                  className="px-4 py-2 bg-gold text-white rounded-lg font-semibold transform scale-90 group-hover:scale-100 transition-transform hover:bg-gold-dark"
                >
                  {language === 'en' ? 'Customize →' : 'تخصيص ←'}
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{card.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{card.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold gold-text">${card.price}</span>
                <span className="text-xs px-2 py-1 bg-gold/10 rounded-full text-gold">
                  {card.category}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}