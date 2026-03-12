import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import MosqueRenderer from './MosqueRenderer';

export default function FamilyPackCard({ pack, showPreview = false, cards = [], cardIndex = 0, isSmall = false }) {
  const { t, language } = useLanguage();
  const [sparklePositions, setSparklePositions] = useState([]);
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  useEffect(() => {
    const positions = [];
    for (let i = 0; i < 15; i++) {
      positions.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        delay: Math.random() * 3
      });
    }
    setSparklePositions(positions);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => 0.3 + Math.random() * 0.5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const colorScheme = pack.colorScheme;
  const currentCard = cards[cardIndex] || { senderName: '', recipientName: '', message: '' };

  return (
    <div className={`relative ${isSmall ? 'w-full' : 'w-full max-w-md mx-auto'}`}>
      {/* Glow effect - same as individual cards */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute inset-[-10px] bg-gradient-to-r from-${colorScheme.accent}/30 via-${colorScheme.glow}/30 to-${colorScheme.accent}/30 rounded-3xl blur-2xl`}
        style={{ opacity: glowIntensity }}
      />

      {/* Main card - same size as individual cards */}
      <motion.div
        whileHover={!isSmall ? { scale: 1.02 } : {}}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl p-1 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.accent}40, ${colorScheme.glow}60, ${colorScheme.accent}40)`
        }}
      >
        <div className={`relative bg-gradient-to-br ${colorScheme.bg} rounded-2xl overflow-hidden`}>
          
          {/* Islamic pattern overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%23${colorScheme.accent === 'gold' ? 'FFD700' : 'FFFFFF'}' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Sparkles */}
          {sparklePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute text-white"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                fontSize: isSmall ? pos.size * 0.8 : pos.size,
                opacity: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: pos.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✦
            </motion.div>
          ))}

          {/* Card Number Badge (for preview) */}
          {showPreview && cards.length > 1 && (
            <div className="absolute top-3 left-3 z-20">
              <span className="bg-gold text-white text-xs px-2 py-1 rounded-full shadow-lg">
                #{cardIndex + 1}
              </span>
            </div>
          )}

          {/* Pack badge (for main display) */}
          {!showPreview && pack.badge && (
            <div className="absolute top-3 left-3 z-20">
              <span className={`bg-${colorScheme.accent} text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg`}>
                {pack.badge}
              </span>
            </div>
          )}

          {/* Content - same padding as individual cards */}
          <div className="relative z-10 p-6">
            
            {/* Mosque - Full size like individual cards */}
            <div className="relative h-28 mb-4 flex justify-center items-center">
              <MosqueRenderer style={pack.mosqueStyle} colorScheme={colorScheme} />
            </div>

            {/* Eid Mubarak text - Always gold, same size */}
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-center mb-3"
            >
              <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">
                {language === 'en' ? 'EID MUBARAK' : 'عيد مبارك'}
              </span>
            </motion.h2>

            {/* Decorative line */}
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-gold text-xs"
              >
                ✦
              </motion.div>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold" />
            </div>

            {/* TOP RIGHT - Sender Name in GOLD - Same as individual cards */}
            {showPreview && currentCard.senderName && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-6 right-6 z-20"
              >
                <div className="text-right">
                  <p className="text-xs text-gold/60 mb-1">
                    From:
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-gold rounded-full"
                    />
                    <p className={`text-lg md:text-xl font-bold bg-gradient-to-r ${colorScheme.text} bg-clip-text text-transparent`}>
                      {currentCard.senderName}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CENTER - Message - Same as individual cards */}
            {showPreview && currentCard.message && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative py-4 px-4"
              >
                {/* Decorative borders */}
                <div className="absolute left-0 top-1/2 w-8 h-px bg-gradient-to-r from-transparent to-gold/50" />
                <div className="absolute right-0 top-1/2 w-8 h-px bg-gradient-to-l from-transparent to-gold/50" />
                
                {/* Message with golden glow */}
                <motion.p 
                  animate={{ 
                    textShadow: [
                      '0 0 5px rgba(255,215,0,0.3)',
                      '0 0 15px rgba(255,215,0,0.6)',
                      '0 0 5px rgba(255,215,0,0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm md:text-base text-center leading-relaxed text-white/90 px-2"
                >
                  {currentCard.message}
                </motion.p>
              </motion.div>
            )}

            {/* Recipient name (if exists) */}
            {showPreview && currentCard.recipientName && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-center text-gold/60 mt-2"
              >
                → {currentCard.recipientName}
              </motion.p>
            )}

            {/* Placeholder for blank state */}
            {!showPreview && (
              <div className="py-8 text-center">
                <p className="text-sm text-white/40 italic">
                  {language === 'en' ? '✨ Your family messages will appear here ✨' : '✨ رسائل عائلتك ستظهر هنا ✨'}
                </p>
              </div>
            )}

            {/* Bottom decoration */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-center text-[10px] text-gold/40 font-arabic">
                {language === 'en' ? '✨ تقبل الله طاعتكم ✨' : '✨ May Allah accept your deeds ✨'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}