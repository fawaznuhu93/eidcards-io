import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import PremiumCard from '../components/PremiumCard';
import { premiumCards } from '../data/premiumCards';

export default function IndividualCards() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleCustomize = (cardId) => {
    console.log('Navigating to card:', cardId);
    navigate(`/card/${cardId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gold-text">
          {language === 'en' ? '✨ Premium Collection' : '✨ المجموعة المميزة'}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {language === 'en'
            ? 'Each card is uniquely designed with its own personality and style'
            : 'كل بطاقة مصممة بشكل فريد بشخصيتها وأسلوبها الخاص'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {premiumCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="relative">
              {/* Card preview - with all design elements */}
              <PremiumCard 
                card={card} 
                showName="" // Empty - waiting for user's name
                showMessage={false} // No message
                isBlank={true} // Pass blank prop
              />
              
              {/* Overlay with customize button */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCustomize(card.id);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-gold to-amber-500 text-white rounded-lg font-semibold transform scale-90 group-hover:scale-100 transition-transform shadow-xl cursor-pointer"
                >
                  {language === 'en' ? '✨ Customize Now' : '✨ تخصيص الآن'}
                </button>
              </div>
              
              {/* "Customize Me" badge */}
              <div className="absolute top-2 left-2 bg-gold/90 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                ⚡ {language === 'en' ? 'Add your name' : 'أضف اسمك'}
              </div>
            </div>
            
            {/* Card info */}
            <div 
              className="mt-4 text-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCustomize(card.id);
              }}
            >
              <h3 className="text-xl font-bold mb-1">{card.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{card.description}</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold gold-text">${card.price}</span>
                <span className="text-xs px-2 py-1 bg-gold/10 rounded-full text-gold">
                  {card.category}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}