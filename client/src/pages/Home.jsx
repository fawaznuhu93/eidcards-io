import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import SampleCard from '../components/SampleCard';
import PremiumCard from '../components/PremiumCard';
import FeedbackForm from '../components/FeedbackForm';
import ResponsiveNavbar from '../components/ResponsiveNavbar';

// Homepage specific cards - Gold, White, Yellow
const homepageCards = [
  {
    id: 'gold-imperial',
    name: 'Imperial Gold',
    price: 5,
    category: 'gold',
    description: 'Majestic gold with Ottoman mosque',
    colorScheme: {
      bg: 'from-amber-900/30 via-yellow-800/30 to-amber-900/30',
      cardBg: 'from-amber-900 via-yellow-800 to-amber-900',
      accent: 'gold',
      text: 'from-gold to-amber-300',
      glow: 'amber-500'
    },
    mosqueStyle: 'ottoman'
  },
  {
    id: 'diamond-pearl',
    name: 'Diamond Pearl',
    price: 5,
    category: 'white',
    description: 'Elegant pearl white with modern mosque',
    colorScheme: {
      bg: 'from-gray-100/30 via-white/30 to-gray-100/30',
      cardBg: 'from-gray-100 via-white to-gray-100',
      accent: 'pearl',
      text: 'from-gray-600 to-gray-800',
      glow: 'gray-300'
    },
    mosqueStyle: 'modern'
  },
  {
    id: 'desert-sunset',
    name: 'Desert Sunset',
    price: 5,
    category: 'yellow',
    description: 'Warm sunset yellow with Arabian mosque',
    colorScheme: {
      bg: 'from-yellow-900/30 via-amber-800/30 to-yellow-900/30',
      cardBg: 'from-yellow-900 via-amber-800 to-yellow-900',
      accent: 'yellow',
      text: 'from-yellow-300 to-amber-300',
      glow: 'yellow-400'
    },
    mosqueStyle: 'arabian'
  }
];

export default function Home() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true });
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = (cardId) => {
    navigate(`/card/${cardId}`);
  };

  return (
    <div className="min-h-screen">
      <ResponsiveNavbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        {/* HERO SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent
                           animate-pulse-slow">
              EidCards.io
            </span>
          </h1>
          
          {/* Decorative stars */}
          <div className="flex justify-center gap-1 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity 
                }}
                className="text-lg sm:text-xl md:text-2xl"
              >
                ⭐
              </motion.span>
            ))}
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 mb-2 sm:mb-3 md:mb-4 gold-text px-2">
            {t.hero.title}
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 px-4">
            {t.hero.subtitle}
          </p>
          
          {/* SAMPLE CARD - Shows Fawaz Yusuf example */}
          <SampleCard />
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/individual')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gold to-amber-500 
                       text-white rounded-full font-bold text-sm sm:text-base md:text-lg 
                       shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>🎨</span>
              <span>{t.nav.browse}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/video')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm 
                       text-gold border-2 border-gold rounded-full font-bold text-sm sm:text-base md:text-lg 
                       hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <span>📺</span>
              <span>{t.nav.watch}</span>
            </motion.button>
          </div>
        </motion.section>

        {/* FEATURES SECTION */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 text-center group cursor-pointer"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4 transform group-hover:scale-110 transition-transform">✨</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 gold-text">{t.features.personalized.title}</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">{t.features.personalized.desc}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 text-center group cursor-pointer"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4 transform group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 gold-text">{t.features.instant.title}</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">{t.features.instant.desc}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 text-center group cursor-pointer sm:col-span-2 lg:col-span-1"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4 transform group-hover:scale-110 transition-transform">🎨</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 gold-text">{t.features.unique.title}</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">{t.features.unique.desc}</p>
          </motion.div>
        </section>

        {/* FEATURED CARDS SECTION - Gold, White, Yellow */}
        <motion.section
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-3 md:mb-4 gold-text">
            {language === 'en' ? '✨ Featured Collection' : '✨ مجموعة مميزة'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-gray-600 mb-6 sm:mb-8 md:mb-12 px-4">
            {language === 'en'
              ? 'Gold • White • Yellow - Each uniquely designed'
              : 'ذهبي • أبيض • أصفر - كل منها مصمم بشكل فريد'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {homepageCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => handleCardClick(card.id)}
              >
                <div className="relative">
                  <PremiumCard card={card} showName="Fawaz Yusuf" showMessage={false} />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(card.id);
                      }}
                      className="px-6 py-3 bg-gold text-white rounded-lg font-semibold transform scale-90 group-hover:scale-100 transition-transform hover:bg-gold-dark"
                    >
                      {language === 'en' ? '✨ Customize' : '✨ تخصيص'}
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold mb-1">{card.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{card.description}</p>
                  <span className="text-2xl font-bold gold-text">${card.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FEEDBACK FORM */}
        <section className="max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-2">
          <FeedbackForm />
        </section>
      </main>
    </div>
  );
}