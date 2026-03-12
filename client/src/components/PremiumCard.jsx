import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import MosqueRenderer from './MosqueRenderer';

export default function PremiumCard({ 
  card, 
  showName = '', 
  showMessage = false, 
  isBlank = false,
  customMessage = '',
  recipientName = '' 
}) {
  const { t, language } = useLanguage();
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [rotation, setRotation] = useState(0);

  // Animated glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => 0.3 + Math.random() * 0.5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Rotate background text
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const colorScheme = card.colorScheme;

  // Arabic text for background
  const arabicText = "عيد مبارك • تقبل الله طاعتكم • كل عام وأنتم بخير • ";
  const arabicTextRepeated = arabicText.repeat(10);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glow effect */}
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

      {/* Main card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl p-1 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.accent}40, ${colorScheme.glow}60, ${colorScheme.accent}40)`
        }}
      >
        <div className={`relative bg-gradient-to-br ${colorScheme.bg} rounded-2xl overflow-hidden`}>
          
          {/* ===== MOVING GOLDEN ARABIC TEXT BACKGROUND ===== */}
          <div className="absolute inset-0 overflow-hidden">
            {/* First moving layer - horizontal */}
            <motion.div
              animate={{
                x: [0, -1000],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-0 left-0 whitespace-nowrap text-6xl font-arabic text-gold/5"
              style={{
                writingMode: 'horizontal-tb',
                transform: `rotate(-15deg)`,
              }}
            >
              {arabicTextRepeated}
            </motion.div>

            {/* Second moving layer - vertical with different speed */}
            <motion.div
              animate={{
                y: [0, -1000],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute left-10 top-0 whitespace-nowrap text-7xl font-arabic text-gold/5"
              style={{
                writingMode: 'vertical-rl',
                transform: `rotate(180deg)`,
              }}
            >
              {arabicTextRepeated}
            </motion.div>

            {/* Third moving layer - diagonal with different speed */}
            <motion.div
              animate={{
                x: [0, -1500],
                y: [0, -500],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-20 left-20 whitespace-nowrap text-8xl font-arabic text-gold/5"
              style={{
                transform: `rotate(45deg)`,
              }}
            >
              {arabicTextRepeated}
            </motion.div>

            {/* Fourth layer - reverse direction */}
            <motion.div
              animate={{
                x: [-1000, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-0 right-0 whitespace-nowrap text-6xl font-arabic text-gold/5"
              style={{
                transform: `rotate(15deg)`,
              }}
            >
              {arabicTextRepeated}
            </motion.div>
          </div>

          {/* Islamic geometric pattern overlay - subtle */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%23FFD700' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Card content */}
          <div className="relative z-10 p-6">
            
            {/* Top right corner - Name in BLACK */}
            {!isBlank && showName ? (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-6 right-6 z-20"
              >
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">
                    {t.sampleCard.from}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-gray-800 rounded-full"
                    />
                    <p className="text-lg md:text-xl font-bold text-gray-800">
                      {showName}
                    </p>
                  </div>
                  {recipientName && (
                    <p className="text-xs text-gray-500 mt-1">
                      → {recipientName}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Placeholder for blank state */
              <div className="absolute top-6 right-6 z-20 opacity-30">
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">From:</p>
                  <div className="flex items-center gap-1 justify-end">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <p className="text-lg md:text-xl text-gray-400">
                      Your Name
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mosque - Different styles per card */}
            <MosqueRenderer style={card.mosqueStyle} colorScheme={colorScheme} />

            {/* EID MUBARAK text - GOLD for all cards */}
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              <span className="bg-gradient-to-r from-gold to-amber-500 bg-clip-text text-transparent">
                {language === 'en' ? 'EID MUBARAK' : 'عيد مبارك'}
              </span>
            </motion.h2>

            {/* Decorative line - Gold */}
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-gold"
              >
                ✦
              </motion.div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold" />
            </div>

            {/* Message in BLACK */}
            {showMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-sm md:text-base text-gray-800 px-4"
              >
                {customMessage || t.sampleCard.message}
              </motion.p>
            )}

            {/* Blank state message */}
            {isBlank && !showMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-center text-xs text-gray-500 px-4 italic"
              >
                {language === 'en' ? '✨ Your message will appear here ✨' : '✨ رسالتك ستظهر هنا ✨'}
              </motion.p>
            )}

            {/* Bottom decoration with Arabic text - Gold */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-center text-xs text-gold/60 font-arabic">
                {language === 'en' ? '✨ تقبل الله طاعتكم ✨' : '✨ May Allah accept your deeds ✨'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}