import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="relative px-4 py-2 rounded-full bg-gradient-to-r from-gold/10 to-amber-500/10 
                 border-2 border-gold/30 text-gold font-semibold 
                 hover:bg-gold hover:text-white transition-all duration-300
                 overflow-hidden group"
    >
      {/* Shine effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] 
                    bg-gradient-to-r from-transparent via-white/20 to-transparent 
                    transition-transform duration-1000" />
      
      {/* Language text with flag */}
      <span className="relative z-10 flex items-center gap-2">
        {language === 'en' ? (
          <>
            <span>🇸🇦</span>
            <span>عربي</span>
          </>
        ) : (
          <>
            <span>🇬🇧</span>
            <span>English</span>
          </>
        )}
      </span>
    </motion.button>
  );
}