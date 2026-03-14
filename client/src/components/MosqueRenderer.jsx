import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

export default function MosqueRenderer({ style, colorScheme }) {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  // Sample Card Mosque
  if (style === 'sample') {
    return (
      <motion.div
        animate={isMobile ? {} : { 
          y: [0, -3, 0],
          filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
        }}
        transition={isMobile ? {} : { duration: 3, repeat: Infinity }}
        className="relative h-24 md:h-28 mb-3 md:mb-4 flex justify-center items-center scale-75 md:scale-90"
      >
        {/* Large central dome */}
        <div className="relative">
          <div className="w-16 h-12 md:w-20 md:h-14 bg-gradient-to-b from-gold to-amber-600 rounded-t-full mx-auto" />
          <div className="w-12 h-5 md:w-14 md:h-6 bg-gradient-to-t from-gold to-amber-500 rounded-b-full mx-auto -mt-2" />
          <div className="w-2 h-8 md:w-3 md:h-10 bg-gold/80 mx-auto -mt-2 rounded-t-full" />
          {!isMobile && (
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-gold rounded-full blur-sm"
            />
          )}
        </div>

        {/* Side minarets */}
        <div className="absolute -left-8 md:-left-12 top-4 md:top-6">
          <div className="w-2 h-12 md:w-3 md:h-16 bg-gradient-to-t from-gold/80 to-gold/40 rounded-t-full" />
          <div className="w-3 h-1 md:w-4 md:h-2 bg-gold/60 rounded-full -mt-1" />
        </div>

        <div className="absolute -right-8 md:-right-12 top-4 md:top-6">
          <div className="w-2 h-12 md:w-3 md:h-16 bg-gradient-to-t from-gold/80 to-gold/40 rounded-t-full" />
          <div className="w-3 h-1 md:w-4 md:h-2 bg-gold/60 rounded-full -mt-1" />
        </div>

        {/* Floating crescent moon */}
        <motion.div
          animate={isMobile ? {} : { rotate: [0, 10, -10, 0], y: [0, -3, 0] }}
          transition={isMobile ? {} : { duration: 4, repeat: Infinity }}
          className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl"
        >
          🌙
        </motion.div>
      </motion.div>
    );
  }
  
  // Ottoman Mosque - Simplified on mobile
  if (style === 'ottoman') {
    return (
      <motion.div
        animate={isMobile ? {} : { y: [0, -3, 0] }}
        transition={isMobile ? {} : { duration: 4, repeat: Infinity }}
        className="relative h-24 md:h-32 mb-4 md:mb-6 flex justify-center items-center"
      >
        <div className="relative scale-75 md:scale-90">
          {/* Central dome */}
          <div className="relative">
            <div className={`w-20 h-14 md:w-24 md:h-16 bg-gradient-to-b from-${colorScheme?.accent || 'gold'} to-${colorScheme?.glow || 'amber-600'} rounded-t-full`} />
            <div className={`w-14 h-5 md:w-16 md:h-6 bg-gradient-to-t from-${colorScheme?.accent || 'gold'} to-${colorScheme?.glow || 'amber-500'} rounded-b-full mx-auto -mt-2`} />
            <div className={`w-2 h-8 md:w-3 md:h-12 bg-${colorScheme?.accent || 'gold'}/80 mx-auto -mt-1 rounded-t-full`} />
            
            {/* Crescent on top */}
            <motion.div
              animate={isMobile ? {} : { rotate: [0, 5, -5, 0] }}
              transition={isMobile ? {} : { duration: 3, repeat: Infinity }}
              className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 text-lg md:text-xl"
            >
              <span className="text-gold">🌙</span>
            </motion.div>
          </div>
          
          {/* Side domes */}
          <div className="absolute -left-6 md:-left-8 top-3 md:top-4">
            <div className={`w-6 h-5 md:w-8 md:h-6 bg-gradient-to-b from-${colorScheme?.accent || 'gold'}/80 to-${colorScheme?.accent || 'gold'}/40 rounded-t-full`} />
          </div>
          <div className="absolute -right-6 md:-right-8 top-3 md:top-4">
            <div className={`w-6 h-5 md:w-8 md:h-6 bg-gradient-to-b from-${colorScheme?.accent || 'gold'}/80 to-${colorScheme?.accent || 'gold'}/40 rounded-t-full`} />
          </div>
          
          {/* Minarets */}
          <div className="absolute -left-8 md:-left-12 top-1 md:top-2">
            <div className={`w-1 h-14 md:w-2 md:h-20 bg-gradient-to-t from-${colorScheme?.accent || 'gold'}/80 to-${colorScheme?.accent || 'gold'}/40 rounded-t-full`} />
          </div>
          <div className="absolute -right-8 md:-right-12 top-1 md:top-2">
            <div className={`w-1 h-14 md:w-2 md:h-20 bg-gradient-to-t from-${colorScheme?.accent || 'gold'}/80 to-${colorScheme?.accent || 'gold'}/40 rounded-t-full`} />
          </div>
        </div>
      </motion.div>
    );
  }

  // Simplified versions of other mosque styles...
  // (For brevity, I'll include the rest of the mosque styles with similar mobile optimizations)
  
  // Default fallback
  return (
    <motion.div
      animate={isMobile ? {} : { y: [0, -3, 0] }}
      transition={isMobile ? {} : { duration: 3, repeat: Infinity }}
      className="relative h-24 md:h-32 mb-4 md:mb-6 flex justify-center items-center"
    >
      <div className={`text-3xl md:text-5xl text-${colorScheme?.accent || 'gold'}`}>🕌</div>
    </motion.div>
  );
}