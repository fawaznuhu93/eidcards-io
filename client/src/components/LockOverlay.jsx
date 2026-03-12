import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function LockOverlay({ show = true }) {
  const { language } = useLanguage();

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ pointerEvents: 'none' }} // Allow clicking through to payment button
    >
      {/* Dark blur overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      
      {/* Lock icon and message */}
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative z-10 text-center p-8"
      >
        {/* Large lock icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-8xl mb-4 filter drop-shadow-2xl"
        >
          🔒
        </motion.div>

        {/* Lock body (for extra effect) */}
        <motion.div
          animate={{ 
            y: [0, -2, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity
          }}
          className="w-24 h-24 bg-gradient-to-br from-gold to-amber-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl border-4 border-white/30"
        >
          <div className="w-12 h-16 bg-white/90 rounded-t-full flex items-center justify-center">
            <div className="w-4 h-8 bg-gold rounded-full" />
          </div>
        </motion.div>
        
        {/* Main message */}
        <motion.h3
          animate={{ 
            textShadow: [
              '0 0 20px rgba(255,215,0,0.3)',
              '0 0 40px rgba(255,215,0,0.6)',
              '0 0 20px rgba(255,215,0,0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg"
        >
          {language === 'en' ? '🔒 PREVIEW MODE' : '🔒 وضع المعاينة'}
        </motion.h3>
        
        {/* Sub message */}
        <p className="text-lg text-white/80 mb-4 max-w-xs mx-auto">
          {language === 'en' 
            ? 'Complete payment to unlock and download your beautiful card' 
            : 'أكمل الدفع لإلغاء القفل وتنزيل بطاقتك الجميلة'}
        </p>
        
        {/* Security badges */}
        <div className="flex justify-center gap-3 mt-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, delay: 0, repeat: Infinity }}
            className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white border border-white/30"
          >
            🔒 Encrypted
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
            className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white border border-white/30"
          >
            💳 Secure Payment
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, delay: 0.6, repeat: Infinity }}
            className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white border border-white/30"
          >
            ⚡ Instant Download
          </motion.div>
        </div>

        {/* Pulsing "UNLOCK" text */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-6 text-2xl font-bold text-gold"
        >
          {language === 'en' ? '⬇️ UNLOCK WITH PAYMENT ⬇️' : '⬇️ افتح بالدفع ⬇️'}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}