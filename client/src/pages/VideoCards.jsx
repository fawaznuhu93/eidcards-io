import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import VideoPreview from '../components/VideoPreview';
import { videoCards } from '../data/videoCards';

export default function VideoCards() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [playingId, setPlayingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCustomize = (cardId) => {
    // Navigate to video card customization page
    console.log('Navigating to video card:', cardId);
    navigate(`/video-card/${cardId}`);
  };

  const handlePreview = (cardId) => {
    setPlayingId(playingId === cardId ? null : cardId);
  };

  const categories = [
    { id: 'all', name: { en: 'All Videos', ar: 'جميع الفيديوهات' } },
    { id: 'gold', name: { en: 'Gold Collection', ar: 'المجموعة الذهبية' } },
    { id: 'emerald', name: { en: 'Emerald Collection', ar: 'مجموعة الزمرد' } },
    { id: 'blue', name: { en: 'Sapphire Collection', ar: 'مجموعة الياقوت' } },
    { id: 'red', name: { en: 'Ruby Collection', ar: 'مجموعة الروبي' } },
    { id: 'purple', name: { en: 'Purple Collection', ar: 'المجموعة الأرجوانية' } },
    { id: 'pink', name: { en: 'Pink Collection', ar: 'المجموعة الوردية' } },
    { id: 'orange', name: { en: 'Orange Collection', ar: 'المجموعة البرتقالية' } },
    { id: 'silver', name: { en: 'Silver Collection', ar: 'المجموعة الفضية' } },
    { id: 'special', name: { en: 'Special Edition', ar: 'إصدار خاص' } }
  ];

  const filteredCards = selectedCategory === 'all' 
    ? videoCards 
    : videoCards.filter(card => card.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gold-text">
          {language === 'en' ? '🎬 Premium Video Cards' : '🎬 بطاقات فيديو فاخرة'}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {language === 'en'
            ? 'Animated premium greetings that bring your wishes to life'
            : 'تهانينا متحركة فاخرة تجعل تمنياتك تنبض بالحياة'}
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap justify-center gap-2 mb-12"
      >
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-gold text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gold/20'
            }`}
          >
            {language === 'en' ? cat.name.en : cat.name.ar}
          </button>
        ))}
      </motion.div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group cursor-pointer"
            onClick={() => handleCustomize(card.id)} // Make whole card clickable
          >
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gold/20">
              {/* Video Preview */}
              <div onClick={(e) => e.stopPropagation()}> {/* Prevent click on preview from navigating */}
                <VideoPreview
                  type={card.previewType}
                  colorScheme={card.colorScheme}
                  isPlaying={playingId === card.id}
                  onPlay={() => handlePreview(card.id)}
                  userName=""
                  message=""
                />
              </div>
              
              {/* Card Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{card.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{card.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {card.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-gold/10 rounded-full text-gold"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold gold-text">${card.price}</span>
                    <p className="text-xs text-gray-500">{card.duration} • {card.resolution}</p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent double navigation
                      handleCustomize(card.id);
                    }}
                    className="px-4 py-2 bg-gold text-white rounded-lg font-semibold hover:bg-gold-dark transition-colors"
                  >
                    {language === 'en' ? 'Customize →' : 'تخصيص ←'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-500 text-lg">
            {language === 'en' 
              ? 'No videos in this category yet' 
              : 'لا توجد فيديوهات في هذه الفئة بعد'}
          </p>
        </motion.div>
      )}
    </div>
  );
}