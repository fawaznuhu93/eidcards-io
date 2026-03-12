import { motion, useAnimation, useInView } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SampleCard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [sparklePositions, setSparklePositions] = useState([]);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  const controls = useAnimation();

  // Generate random sparkle positions
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

  // Animate when in view
  useEffect(() => {
    if (isInView) {
      controls.start({
        scale: 1,
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, type: "spring", stiffness: 100 }
      });
    }
  }, [isInView, controls]);

  // Animated glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => 0.3 + Math.random() * 0.5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCustomize = () => {
    // Navigate to the sample card customization page
    navigate('/card/sample-premium');
  };

  return (
    <div className="relative max-w-sm mx-auto mb-16 px-2" ref={cardRef}>
      {/* ===== DECORATIVE BACKGROUND ELEMENTS ===== */}
      
      {/* Main golden glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
          rotate: [0, 3, -3, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-[-15px] bg-gradient-to-r from-amber-300 via-gold to-amber-500 rounded-[30px] blur-2xl"
        style={{ opacity: glowIntensity }}
      />

      {/* Floating golden orbs */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          x: [0, 15, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-8 -left-8 w-24 h-24 bg-gold/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          x: [0, -15, 0],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-8 -right-8 w-28 h-28 bg-amber-500/20 rounded-full blur-xl"
      />
      
      {/* Sparkling stars */}
      {sparklePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute text-gold"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            fontSize: pos.size,
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
          ✨
        </motion.div>
      ))}

      {/* ===== MAIN CARD ===== */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={controls}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-amber-900/10 via-purple-900/10 to-blue-900/10 rounded-2xl p-1 shadow-2xl backdrop-blur-sm cursor-pointer"
        style={{
          boxShadow: '0 20px 40px -10px rgba(255, 215, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.1) inset'
        }}
        onClick={handleCustomize}
      >
        {/* Inner card with luxury texture */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden">
          
          {/* ===== BACKGROUND LAYERS ===== */}
          
          {/* Islamic geometric pattern overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 5 L75 40 L40 75 L5 40 Z' fill='none' stroke='%23FFD700' stroke-width='1'/%3E%3Cpath d='M40 20 L60 40 L40 60 L20 40 Z' fill='none' stroke='%23FFD700' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='40' r='12' fill='none' stroke='%23FFD700' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '120px 120px',
              backgroundPosition: 'center',
            }}
          />

          {/* Luxurious gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-blue-500/5" />

          {/* Animated light rays */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-[-50%] bg-gradient-to-r from-transparent via-gold/5 to-transparent"
            style={{
              transformOrigin: 'center',
            }}
          />

          {/* ===== MAIN CARD CONTENT ===== */}
          <div className="relative z-10 p-5 md:p-6">
            
            {/* Top decorative border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold via-amber-500 to-gold" />
            
            {/* Top right corner decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-gold/20 rounded-bl-full" />
              <div className="absolute top-1 right-1 w-6 h-6 bg-gold/30 rounded-full animate-pulse" />
            </div>

            {/* Top left corner decoration */}
            <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 bg-gold/20 rounded-br-full" />
              <div className="absolute top-1 left-1 w-6 h-6 bg-gold/30 rounded-full animate-pulse delay-1000" />
            </div>

            {/* ===== MOSQUE SILHOUETTE ===== */}
            <div className="relative h-28 mb-4 flex justify-center items-center">
              {/* Main mosque dome */}
              <motion.div
                animate={{ 
                  y: [0, -3, 0],
                  filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative scale-90"
              >
                {/* Large central dome */}
                <div className="relative">
                  <div className="w-20 h-14 bg-gradient-to-b from-gold to-amber-600 rounded-t-full mx-auto" />
                  <div className="w-14 h-6 bg-gradient-to-t from-gold to-amber-500 rounded-b-full mx-auto -mt-2" />
                  <div className="w-3 h-10 bg-gold/80 mx-auto -mt-2 rounded-t-full" />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gold rounded-full blur-sm"
                  />
                </div>

                {/* Side minarets */}
                <div className="absolute -left-12 top-6">
                  <div className="w-3 h-16 bg-gradient-to-t from-gold/80 to-gold/40 rounded-t-full" />
                  <div className="w-4 h-2 bg-gold/60 rounded-full -mt-1" />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-4 bg-gold/80 mx-auto -mt-1 rounded-t-full"
                  />
                </div>

                <div className="absolute -right-12 top-6">
                  <div className="w-3 h-16 bg-gradient-to-t from-gold/80 to-gold/40 rounded-t-full" />
                  <div className="w-4 h-2 bg-gold/60 rounded-full -mt-1" />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="w-1.5 h-4 bg-gold/80 mx-auto -mt-1 rounded-t-full"
                  />
                </div>

                {/* Floating crescent moon above dome */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], y: [0, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl"
                >
                  🌙
                </motion.div>
              </motion.div>
            </div>

            {/* ===== EID MUBARAK TEXT ===== */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-3"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-1">
                <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">
                  {language === 'en' ? 'EID MUBARAK' : 'عيد مبارك'}
                </span>
              </h2>
              
              {/* Decorative line under text */}
              <div className="flex justify-center items-center gap-1">
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
            </motion.div>

            {/* ===== FROM FAWAZ YUSUF AT TOP RIGHT (EXAMPLE) ===== */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-4 right-4 z-20"
            >
              <div className="text-right">
                <p className="text-xs text-gold/60 mb-1">
                  {t.sampleCard.from}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1 h-1 bg-gold rounded-full"
                  />
                  <p className="text-base md:text-lg font-bold bg-gradient-to-r from-gold to-amber-500 bg-clip-text text-transparent">
                    Fawaz Yusuf
                  </p>
                </div>
                {/* Small hint text */}
                <p className="text-[8px] text-gold/40 mt-1 italic">
                  {language === 'en' ? '(Your name will appear here)' : '(سيظهر اسمك هنا)'}
                </p>
              </div>
            </motion.div>

            {/* ===== MESSAGE SECTION ===== */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative py-4 px-2"
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
                style={{ 
                  fontFamily: language === 'ar' ? 'Amiri, serif' : 'inherit',
                }}
              >
                {t.sampleCard.message}
              </motion.p>
              {/* Small hint text */}
              <p className="text-[8px] text-gold/40 text-center mt-1 italic">
                {language === 'en' ? '(Your message will appear here)' : '(رسالتك ستظهر هنا)'}
              </p>
            </motion.div>

            {/* ===== BOTTOM DECORATIONS ===== */}
            <div className="mt-4 flex justify-between items-center">
              {/* Left side decorations */}
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 0.3,
                      repeat: Infinity 
                    }}
                    className="w-1 h-1 bg-gold rounded-full"
                  />
                ))}
              </div>

              {/* Center decorations */}
              <div className="flex gap-2">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="text-gold text-lg"
                >
                  ⭐
                </motion.span>
                <motion.span
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="text-gold text-lg"
                >
                  ✨
                </motion.span>
              </div>

              {/* Right side decorations */}
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: 2 - i * 0.3,
                      repeat: Infinity 
                    }}
                    className="w-1 h-1 bg-gold rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Bottom border with calligraphy */}
            <div className="mt-4 pt-3 border-t border-gold/20">
              <p className="text-center text-[10px] text-gold/40 font-arabic">
                {language === 'en' ? '✨ تقبل الله طاعتكم ✨' : '✨ May Allah accept your deeds ✨'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== PREMIUM BADGES & CALLS TO ACTION ===== */}

      {/* Main preview badge */}
      <motion.div 
        animate={{ 
          y: [0, -3, 0],
          rotate: [-1, 1, -1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 
                   bg-gradient-to-r from-gold via-amber-500 to-gold 
                   text-white px-4 py-2 rounded-full text-xs font-bold 
                   shadow-xl flex items-center gap-1 whitespace-nowrap
                   border border-white/50 backdrop-blur-sm z-10"
        style={{
          boxShadow: '0 5px 15px -3px rgba(255,215,0,0.5)'
        }}
      >
        <span>👑</span>
        <span>{t.hero.preview}</span>
        <span>✨</span>
      </motion.div>

      {/* Luxury price tag - Clickable */}
      <motion.div 
        animate={{ 
          x: [0, 3, 0],
          rotate: [0, 3, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 
                   bg-gradient-to-br from-gold to-amber-600 
                   rounded-lg shadow-xl p-2 border border-white
                   cursor-pointer hover:scale-110 transition-transform z-30"
        onClick={(e) => {
          e.stopPropagation();
          handleCustomize();
        }}
      >
        <div className="text-[10px] text-white/80 text-center">Start</div>
        <div className="text-lg font-bold text-white text-center">$5</div>
        <div className="text-[8px] text-white/60 text-center">Premium</div>
      </motion.div>

      {/* CUSTOMIZE BUTTON - Main Call to Action */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCustomize}
        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                   bg-gradient-to-r from-gold to-amber-500 
                   text-white px-6 py-2.5 rounded-full text-sm font-bold 
                   shadow-xl flex items-center gap-2 whitespace-nowrap
                   border border-white/50 z-30 hover:shadow-2xl transition-all
                   hover:from-amber-500 hover:to-gold"
      >
        <span>✨</span>
        <span>{language === 'en' ? 'Make It Yours - Add Your Name' : 'اجعله لك - أضف اسمك'}</span>
        <span>→</span>
      </motion.button>

      {/* Limited edition badge */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -left-3 top-8 bg-red-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-lg rotate-[-10deg] z-20"
      >
        LIMITED
      </motion.div>

      {/* Gold foil seal - Clickable */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -right-1 w-8 h-8 bg-gradient-to-br from-gold to-amber-600 rounded-full 
                   flex items-center justify-center shadow-lg border border-white z-20
                   cursor-pointer hover:scale-110 transition-transform"
        onClick={(e) => {
          e.stopPropagation();
          handleCustomize();
        }}
      >
        <span className="text-white text-[8px] font-bold">✨</span>
      </motion.div>

      {/* Hover instruction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.5 }}
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                   bg-black/50 text-white text-xs px-3 py-1 rounded-full
                   backdrop-blur-sm whitespace-nowrap"
      >
        👆 {language === 'en' ? 'Click to add YOUR name' : 'انقر لإضافة اسمك'}
      </motion.div>
    </div>
  );
}