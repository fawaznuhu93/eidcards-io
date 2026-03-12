import { motion } from 'framer-motion';

export default function MosqueRenderer({ style, colorScheme }) {
  
  // Sample Card Mosque - Exact replica of the sample card mosque
  if (style === 'sample') {
    return (
      <motion.div
        animate={{ 
          y: [0, -3, 0],
          filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative h-28 mb-4 flex justify-center items-center scale-90"
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
    );
  }
  
  // Ottoman Mosque (Classic Istanbul style) - Using card's color scheme
  if (style === 'ottoman') {
    return (
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative h-32 mb-6 flex justify-center items-center"
      >
        <div className="relative">
          {/* Central dome */}
          <div className="relative">
            <div className={`w-24 h-16 bg-gradient-to-b from-${colorScheme.accent} to-${colorScheme.glow} rounded-t-full`} />
            <div className={`w-16 h-6 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.glow} rounded-b-full mx-auto -mt-2`} />
            <div className={`w-3 h-12 bg-${colorScheme.accent}/80 mx-auto -mt-1 rounded-t-full`} />
            
            {/* Crescent on top - Gold for all cards */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xl"
            >
              <span className="text-gold">🌙</span>
            </motion.div>
          </div>
          
          {/* Side semi-domes */}
          <div className="absolute -left-8 top-4">
            <div className={`w-8 h-6 bg-gradient-to-b from-${colorScheme.accent}/80 to-${colorScheme.accent}/40 rounded-t-full`} />
          </div>
          <div className="absolute -right-8 top-4">
            <div className={`w-8 h-6 bg-gradient-to-b from-${colorScheme.accent}/80 to-${colorScheme.accent}/40 rounded-t-full`} />
          </div>
          
          {/* Minarets */}
          <div className="absolute -left-12 top-2">
            <div className={`w-2 h-20 bg-gradient-to-t from-${colorScheme.accent}/80 to-${colorScheme.accent}/40 rounded-t-full`} />
            <div className={`w-3 h-2 bg-${colorScheme.accent}/60 rounded-full -mt-1 -ml-0.5`} />
          </div>
          <div className="absolute -right-12 top-2">
            <div className={`w-2 h-20 bg-gradient-to-t from-${colorScheme.accent}/80 to-${colorScheme.accent}/40 rounded-t-full`} />
            <div className={`w-3 h-2 bg-${colorScheme.accent}/60 rounded-full -mt-1 -ml-0.5`} />
          </div>
          
          {/* Base platform */}
          <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-${colorScheme.accent}/40 via-${colorScheme.accent} to-${colorScheme.accent}/40 rounded-full`} />
        </div>
      </motion.div>
    );
  }

  // Andalusian Mosque - Rich terracotta/copper tones
  if (style === 'andalusian') {
    return (
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative h-32 mb-6 flex justify-center items-center"
      >
        <div className="relative">
          {/* Horseshoe arches */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i} 
                className="relative"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              >
                <div className="w-8 h-12 border-2 border-copper rounded-t-full" 
                     style={{ borderColor: '#B87333' }} />
                <div className="w-5 h-6 bg-copper/20 absolute top-3 left-1.5 rounded-t-full"
                     style={{ backgroundColor: 'rgba(184,115,51,0.2)' }} />
                <div className="w-2 h-2 bg-copper rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                     style={{ backgroundColor: '#B87333' }} />
              </motion.div>
            ))}
          </div>
          
          {/* Square minaret */}
          <div className="absolute -right-16 -top-4">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-8 h-24 bg-gradient-to-t from-copper to-copper/40"
                   style={{ background: 'linear-gradient(to top, #B87333, #CD7F32)' }}>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 border border-white/60" />
                  <div className="w-2 h-2 border border-white/60" />
                </div>
              </div>
              <div className="w-10 h-2 bg-copper/60 -mt-1 -ml-1 rounded-t-lg"
                   style={{ backgroundColor: '#CD7F32' }} />
              <div className="w-3 h-4 bg-copper mx-auto -mt-1 rounded-t-full"
                   style={{ backgroundColor: '#B87333' }} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Persian Mosque - Turquoise/Blue tones
  if (style === 'persian') {
    return (
      <motion.div
        animate={{ skewX: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative h-32 mb-6 flex justify-center items-center"
      >
        <div className="relative">
          {/* Persian dome */}
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative"
          >
            <div className="w-28 h-20 bg-gradient-to-b from-turquoise to-blue-600 rounded-t-full relative overflow-hidden"
                 style={{ background: 'linear-gradient(to bottom, #40E0D0, #1E90DB)' }}>
              <div className="absolute inset-0 opacity-30" 
                style={{
                  backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 1px, transparent 1px)',
                  backgroundSize: '10px 10px'
                }} />
            </div>
            <div className="w-20 h-4 bg-gradient-to-t from-blue-600/60 to-turquoise/20 rounded-b-full mx-auto -mt-2" />
          </motion.div>
          
          {/* Iwan arch */}
          <div className="w-16 h-10 border-2 border-turquoise rounded-t-2xl mx-auto -mt-4 relative"
               style={{ borderColor: '#40E0D0' }}>
            <div className="absolute inset-1 border border-turquoise/30 rounded-t-lg" />
          </div>
          
          {/* Twin minarets */}
          <div className="absolute -left-12 -top-2">
            <div className="w-3 h-20 bg-gradient-to-t from-turquoise to-blue-500/40 rounded-t-full"
                 style={{ background: 'linear-gradient(to top, #40E0D0, #1E90DB)' }} />
          </div>
          <div className="absolute -right-12 -top-2">
            <div className="w-3 h-20 bg-gradient-to-t from-turquoise to-blue-500/40 rounded-t-full"
                 style={{ background: 'linear-gradient(to top, #40E0D0, #1E90DB)' }} />
          </div>
        </div>
      </motion.div>
    );
  }

  // Moroccan Mosque - Rich blue with geometric patterns
  if (style === 'moroccan') {
    return (
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative h-32 mb-6 flex justify-center items-center"
      >
        <div className="relative">
          {/* Moroccan minaret */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative"
          >
            <div className="w-16 h-28 bg-gradient-to-t from-moroccan-blue to-blue-500 relative overflow-hidden"
                 style={{ background: 'linear-gradient(to top, #2E5A88, #1E3A5F)' }}>
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)'
                }} />
              
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 grid grid-cols-2 gap-2">
                <div className="w-3 h-3 border border-white/60 transform rotate-45" />
                <div className="w-3 h-3 border border-white/60 transform rotate-45" />
              </div>
            </div>
            
            <div className="w-20 h-3 bg-moroccan-blue/60 -mt-1 -ml-2 rounded-t-lg"
                 style={{ backgroundColor: '#2E5A88' }} />
            <div className="w-6 h-5 bg-moroccan-blue rounded-full mx-auto -mt-2"
                 style={{ backgroundColor: '#1E3A5F' }} />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Mughal Mosque - Rich red sandstone with marble
  if (style === 'mughal') {
    return (
      <motion.div
        animate={{ rotateY: [0, 10, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="relative h-32 mb-6 flex justify-center items-center"
      >
        <div className="relative">
          {/* Onion domes */}
          <div className="flex gap-3 items-end">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i} 
                className="relative"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              >
                <div className="relative">
                  <div className="w-10 h-12 bg-gradient-to-b from-white to-gray-200 rounded-t-full" />
                  <div className="w-6 h-3 bg-gradient-to-t from-gray-300 to-white rounded-b-full mx-auto -mt-1" />
                  
                  {i === 1 && (
                    <>
                      <div className="w-2 h-4 bg-gold mx-auto -mt-1 rounded-t-full" />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1 h-2 bg-gold mx-auto rounded-full"
                      />
                    </>
                  )}
                </div>
                
                <div className="w-12 h-2 bg-red-700/80 -mt-1 -ml-1 rounded-full" />
              </motion.div>
            ))}
          </div>
          
          <div className="w-40 h-2 bg-gradient-to-r from-red-700/40 via-red-700 to-red-700/40 mx-auto mt-1 rounded-full" />
          
          <div className="absolute -left-8 -top-4">
            <div className="w-2 h-16 bg-gradient-to-t from-white to-gray-200" />
            <div className="w-4 h-2 bg-gold/60 -mt-1 -ml-1 rounded-full" />
          </div>
          <div className="absolute -right-8 -top-4">
            <div className="w-2 h-16 bg-gradient-to-t from-white to-gray-200" />
            <div className="w-4 h-2 bg-gold/60 -mt-1 -ml-1 rounded-full" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Modern Minimalist Mosque - Sleek silver/chrome
  if (style === 'modern') {
    return (
      <motion.div
        animate={{ scaleX: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative h-32 mb-6 flex justify-center items-center"
      >
        <div className="relative">
          <div className="flex items-end gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [16, 20, 16] }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                className={`w-${i === 1 || i === 3 ? '8' : '4'} h-${i === 1 || i === 3 ? '24' : '16'} bg-gradient-to-t from-gray-400 to-gray-200 rounded-t-lg`}
              />
            ))}
          </div>
          <div className="w-36 h-2 bg-gradient-to-r from-gray-400/40 via-gray-400 to-gray-400/40 mx-auto mt-2 rounded-full" />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-12 h-6 border-2 border-gray-400 rounded-t-full mx-auto mt-2 relative"
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gold rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Arabian Mosque - Golden sand tones
  if (style === 'arabian') {
    return (
      <motion.div
        animate={{ rotate: [0, 1, -1, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative h-32 mb-6 flex justify-center items-center"
      >
        <div className="relative">
          <div className="flex gap-6 items-end">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <div className="w-3 h-20 bg-gradient-to-t from-sandstone to-amber-600 rounded-t-full"
                   style={{ background: 'linear-gradient(to top, #C19A6B, #E0B87B)' }} />
              <div className="w-5 h-2 bg-sandstone/60 -mt-1 -ml-1 rounded-full"
                   style={{ backgroundColor: '#C19A6B' }} />
            </motion.div>
            
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <div className="w-14 h-12 bg-gradient-to-b from-sandstone to-amber-700 rounded-t-full"
                   style={{ background: 'linear-gradient(to bottom, #E0B87B, #B85C1F)' }} />
              <div className="w-10 h-3 bg-gradient-to-t from-amber-700/60 to-sandstone/20 rounded-b-full mx-auto -mt-2" />
              <div className="w-2 h-6 bg-gold mx-auto -mt-1 rounded-t-full" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
              className="relative"
            >
              <div className="w-3 h-20 bg-gradient-to-t from-sandstone to-amber-600 rounded-t-full"
                   style={{ background: 'linear-gradient(to top, #C19A6B, #E0B87B)' }} />
              <div className="w-5 h-2 bg-sandstone/60 -mt-1 -ml-1 rounded-full"
                   style={{ backgroundColor: '#C19A6B' }} />
            </motion.div>
          </div>
          
          <div className="w-32 h-6 border-2 border-gold/50 rounded-t-full mx-auto -mt-4" />
        </div>
      </motion.div>
    );
  }

  // Seljuk Mosque - Deep turquoise with geometric patterns
  if (style === 'seljuk') {
    return (
      <motion.div
        animate={{ skewY: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative h-32 mb-6 flex justify-center items-center"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative"
          >
            <div className="w-20 h-14 bg-gradient-to-b from-seljuk-turquoise to-teal-700 rounded-t-full relative overflow-hidden"
                 style={{ background: 'linear-gradient(to bottom, #2A9D8F, #0F4C5C)' }}>
              <div className="absolute inset-0 opacity-30" 
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,215,0,0.3) 8px, rgba(255,215,0,0.3) 16px)',
                }} />
            </div>
            <div className="w-14 h-4 bg-gradient-to-t from-teal-700/60 to-seljuk-turquoise/20 rounded-b-full mx-auto -mt-2" />
          </motion.div>
          
          <div className="flex justify-between w-32 mx-auto -mt-4">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-3 h-16 bg-gradient-to-t from-teal-700 to-seljuk-turquoise/40"
                   style={{ background: 'linear-gradient(to top, #0F4C5C, #2A9D8F)' }} />
            </motion.div>
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
            >
              <div className="w-3 h-16 bg-gradient-to-t from-teal-700 to-seljuk-turquoise/40"
                   style={{ background: 'linear-gradient(to top, #0F4C5C, #2A9D8F)' }} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Starlit Mosque - Deep purple/blue night sky with gold stars
  if (style === 'starlit') {
    return (
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative h-32 mb-6 flex justify-center items-center"
      >
        <div className="relative">
          <div className="relative">
            <div className="w-24 h-16 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-t-full" />
            <div className="w-18 h-4 bg-gradient-to-t from-purple-900/60 to-indigo-900/20 rounded-b-full mx-auto -mt-2" />
            
            <div className="absolute -left-6 -top-2">
              <div className="w-2 h-14 bg-gradient-to-t from-purple-900 to-indigo-800" />
            </div>
            <div className="absolute -right-6 -top-2">
              <div className="w-2 h-14 bg-gradient-to-t from-purple-900 to-indigo-800" />
            </div>
            
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-gold text-xl"
            >
              🌙
            </motion.div>
          </div>
          
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity 
              }}
              className="absolute text-gold text-xs"
              style={{
                top: `${Math.random() * 100 - 20}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              ✦
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // White/Pearl card - Gold effect
  if (style === 'modern' && colorScheme?.accent === 'pearl') {
    return (
      <motion.div
        animate={{ scaleX: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative h-32 mb-6 flex justify-center items-center"
      >
        <div className="relative">
          <div className="flex items-end gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [16, 20, 16] }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                className={`w-${i === 1 || i === 3 ? '8' : '4'} h-${i === 1 || i === 3 ? '24' : '16'} bg-gradient-to-t from-gold to-amber-500 rounded-t-lg`}
              />
            ))}
          </div>
          <div className="w-36 h-2 bg-gradient-to-r from-gold/40 via-gold to-gold/40 mx-auto mt-2 rounded-full" />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-12 h-6 border-2 border-gold rounded-t-full mx-auto mt-2"
          />
        </div>
      </motion.div>
    );
  }

  // Default fallback
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="relative h-32 mb-6 flex justify-center items-center"
    >
      <div className={`text-5xl text-${colorScheme?.accent || 'gold'}`}>🕌</div>
    </motion.div>
  );
}