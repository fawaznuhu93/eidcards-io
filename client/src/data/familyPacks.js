export const familyPacks = [
  // ===== SAMPLE CARD FAMILY PACK (Premium Gold/Purple) =====
  {
    id: 'family-sample-premium',
    name: 'Royal Premium Family Pack',
    price: 15,
    category: 'premium',
    description: 'Luxurious gold and purple design - perfect for family',
    longDescription: 'Our most popular design now available for the whole family. Each card features the same stunning gold and purple aesthetic with Ottoman mosque.',
    colorScheme: {
      bg: 'from-gray-900 via-gray-800 to-gray-900',
      cardBg: 'from-gray-900 via-gray-800 to-gray-900',
      accent: 'gold',
      text: 'from-gold to-amber-300',
      glow: 'amber-500'
    },
    mosqueStyle: 'sample',
    badge: 'BESTSELLER',
    features: [
      'Same premium design for all cards',
      'Ottoman mosque with gold details',
      'Floating crescent moon',
      'Islamic geometric patterns',
      'Perfect for family of 2-5'
    ],
    sampleCard: true,
    recommendedFor: 'Large families who want matching premium cards'
  },

  // ===== SILVER FAMILY PACK (Elegant Grey/Silver) =====
  {
    id: 'family-silver-elegance',
    name: 'Silver Elegance Family Pack',
    price: 15,
    category: 'silver',
    description: 'Sophisticated silver with modern mosque',
    longDescription: 'Clean, modern silver design with geometric patterns. Perfect for contemporary families who appreciate minimalist elegance.',
    colorScheme: {
      bg: 'from-gray-700 via-gray-600 to-gray-700',
      cardBg: 'from-gray-700 via-gray-600 to-gray-700',
      accent: 'silver',
      text: 'from-gray-100 to-gray-200',
      glow: 'gray-400'
    },
    mosqueStyle: 'modern',
    badge: 'MODERN',
    features: [
      'Sleek silver geometric design',
      'Modern minimalist mosque',
      'Chrome-like reflections',
      'Clean lines and patterns',
      'Contemporary family aesthetic'
    ],
    recommendedFor: 'Modern families who love minimalist design'
  },

  // ===== GOLD FAMILY PACK (Classic Gold) =====
  {
    id: 'family-gold-heritage',
    name: 'Golden Heritage Family Pack',
    price: 15,
    category: 'gold',
    description: 'Classic gold with Ottoman mosque',
    longDescription: 'Timeless gold design featuring magnificent Ottoman architecture. Each card glows with warmth and tradition.',
    colorScheme: {
      bg: 'from-amber-900 via-yellow-800 to-amber-900',
      cardBg: 'from-amber-900 via-yellow-800 to-amber-900',
      accent: 'gold',
      text: 'from-gold to-amber-300',
      glow: 'amber-500'
    },
    mosqueStyle: 'ottoman',
    badge: 'CLASSIC',
    features: [
      'Rich gold gradients',
      'Ottoman mosque with multiple domes',
      'Traditional Islamic patterns',
      'Warm amber glow',
      'Timeless family treasure'
    ],
    recommendedFor: 'Families who love traditional elegance'
  },

  // ===== WHITE FAMILY PACK (Pearl White) =====
  {
    id: 'family-pearl-white',
    name: 'Pearl White Family Pack',
    price: 15,
    category: 'white',
    description: 'Elegant pearl white with starlit mosque',
    longDescription: 'Pure and pristine white design with sparkling stars. Creates a beautiful, clean aesthetic for family greetings.',
    colorScheme: {
      bg: 'from-gray-100 via-white to-gray-100',
      cardBg: 'from-gray-100 via-white to-gray-100',
      accent: 'pearl',
      text: 'from-gray-600 to-gray-800',
      glow: 'gray-300'
    },
    mosqueStyle: 'starlit',
    badge: 'ELEGANT',
    features: [
      'Crisp pearl white background',
      'Starlit mosque with twinkling stars',
      'Clean and pure aesthetic',
      'Subtle gold accents',
      'Perfect for any family'
    ],
    recommendedFor: 'Families who love clean, bright designs'
  },

  // ===== EMERALD FAMILY PACK (Rich Green) =====
  {
    id: 'family-emerald-royal',
    name: 'Emerald Royal Family Pack',
    price: 15,
    category: 'emerald',
    description: 'Rich emerald with Andalusian mosque',
    longDescription: 'Lush emerald green inspired by Andalusian gardens. Features intricate Moroccan-inspired architecture.',
    colorScheme: {
      bg: 'from-emerald-900 via-green-800 to-emerald-900',
      cardBg: 'from-emerald-900 via-green-800 to-emerald-900',
      accent: 'emerald',
      text: 'from-emerald-300 to-green-300',
      glow: 'emerald-400'
    },
    mosqueStyle: 'andalusian',
    badge: 'LUXURY',
    features: [
      'Rich emerald gradients',
      'Andalusian horseshoe arches',
      'Moroccan geometric patterns',
      'Jewel-like sparkle',
      'Regal family statement'
    ],
    recommendedFor: 'Families who love rich, deep colors'
  },

  // ===== SAPPHIRE FAMILY PACK (Deep Blue) =====
  {
    id: 'family-sapphire-night',
    name: 'Sapphire Night Family Pack',
    price: 15,
    category: 'blue',
    description: 'Deep sapphire with Persian mosque',
    longDescription: 'Mystical blue inspired by Persian nights. Features stunning turquoise domes and star patterns.',
    colorScheme: {
      bg: 'from-blue-900 via-indigo-800 to-blue-900',
      cardBg: 'from-blue-900 via-indigo-800 to-blue-900',
      accent: 'blue',
      text: 'from-blue-300 to-indigo-300',
      glow: 'blue-400'
    },
    mosqueStyle: 'persian',
    badge: 'MYSTICAL',
    features: [
      'Deep sapphire blue',
      'Persian mosque with iwan arch',
      'Twinkling stars and constellations',
      'Turquoise dome accents',
      'Magical family theme'
    ],
    recommendedFor: 'Families who love mystical, night themes'
  },

  // ===== RUBY FAMILY PACK (Passionate Red) =====
  {
    id: 'family-ruby-passion',
    name: 'Ruby Passion Family Pack',
    price: 15,
    category: 'red',
    description: 'Passionate ruby with Mughal mosque',
    longDescription: 'Vibrant red inspired by ruby gemstones. Features magnificent Mughal architecture with onion domes.',
    colorScheme: {
      bg: 'from-red-900 via-rose-800 to-red-900',
      cardBg: 'from-red-900 via-rose-800 to-red-900',
      accent: 'red',
      text: 'from-red-300 to-rose-300',
      glow: 'red-400'
    },
    mosqueStyle: 'mughal',
    badge: 'PASSIONATE',
    features: [
      'Rich ruby red gradients',
      'Mughal onion domes',
      'Red sandstone textures',
      'Gold trim details',
      'Bold family statement'
    ],
    recommendedFor: 'Families who love bold, passionate colors'
  },

  // ===== PURPLE FAMILY PACK (Royal Purple) =====
  {
    id: 'family-purple-royal',
    name: 'Purple Royal Family Pack',
    price: 15,
    category: 'purple',
    description: 'Royal purple with Seljuk mosque',
    longDescription: 'Majestic purple inspired by royalty. Features intricate Seljuk geometric patterns.',
    colorScheme: {
      bg: 'from-purple-900 via-violet-800 to-purple-900',
      cardBg: 'from-purple-900 via-violet-800 to-purple-900',
      accent: 'purple',
      text: 'from-purple-300 to-violet-300',
      glow: 'purple-400'
    },
    mosqueStyle: 'seljuk',
    badge: 'ROYAL',
    features: [
      'Royal purple gradients',
      'Seljuk geometric patterns',
      'Star and polygon designs',
      'Crown-like elements',
      'Fit for a royal family'
    ],
    recommendedFor: 'Families who love regal, majestic designs'
  },

  // ===== PINK FAMILY PACK (Blossom Pink) =====
  {
    id: 'family-pink-blossom',
    name: 'Pink Blossom Family Pack',
    price: 15,
    category: 'pink',
    description: 'Soft pink with Moroccan mosque',
    longDescription: 'Delicate pink inspired by cherry blossoms. Features beautiful Moroccan architecture with floral elements.',
    colorScheme: {
      bg: 'from-pink-900 via-rose-800 to-pink-900',
      cardBg: 'from-pink-900 via-rose-800 to-pink-900',
      accent: 'pink',
      text: 'from-pink-300 to-rose-300',
      glow: 'pink-400'
    },
    mosqueStyle: 'moroccan',
    badge: 'BLOSSOM',
    features: [
      'Soft pink gradients',
      'Moroccan tile patterns',
      'Falling blossom petals',
      'Romantic aesthetic',
      'Perfect for families with daughters'
    ],
    recommendedFor: 'Families who love soft, romantic designs'
  },

  // ===== ORANGE FAMILY PACK (Sunset Orange) =====
  {
    id: 'family-orange-sunset',
    name: 'Sunset Orange Family Pack',
    price: 15,
    category: 'orange',
    description: 'Warm sunset with Arabian mosque',
    longDescription: 'Golden orange inspired by desert sunsets. Features beautiful Arabian architecture with palm motifs.',
    colorScheme: {
      bg: 'from-orange-900 via-amber-800 to-orange-900',
      cardBg: 'from-orange-900 via-amber-800 to-orange-900',
      accent: 'orange',
      text: 'from-orange-300 to-amber-300',
      glow: 'orange-400'
    },
    mosqueStyle: 'arabian',
    badge: 'SUNSET',
    features: [
      'Warm sunset gradients',
      'Arabian mosque with palm motifs',
      'Golden rays and light',
      'Desert-inspired patterns',
      'Warm and welcoming'
    ],
    recommendedFor: 'Families who love warm, earthy tones'
  },

  // ===== COPPER FAMILY PACK (Antique Copper) =====
  {
    id: 'family-copper-antique',
    name: 'Antique Copper Family Pack',
    price: 15,
    category: 'copper',
    description: 'Vintage copper with Mamluk mosque',
    longDescription: 'Rich copper inspired by ancient artifacts. Features intricate Mamluk architecture with geometric precision.',
    colorScheme: {
      bg: 'from-amber-800 via-orange-800 to-amber-800',
      cardBg: 'from-amber-800 via-orange-800 to-amber-800',
      accent: 'copper',
      text: 'from-amber-300 to-orange-300',
      glow: 'amber-600'
    },
    mosqueStyle: 'andalusian',
    badge: 'VINTAGE',
    features: [
      'Antique copper tones',
      'Mamluk geometric patterns',
      'Vintage metallic finish',
      'Timeless appeal',
      'Heirloom quality'
    ],
    recommendedFor: 'Families who love vintage, timeless designs'
  },

  // ===== STARLIT FAMILY PACK (Night Sky) =====
  {
    id: 'family-starlit-night',
    name: 'Starlit Night Family Pack',
    price: 15,
    category: 'indigo',
    description: 'Deep indigo night with starlit mosque',
    longDescription: 'Magical night sky filled with stars. Features a beautiful mosque silhouetted against the cosmos.',
    colorScheme: {
      bg: 'from-indigo-900 via-purple-900 to-indigo-900',
      cardBg: 'from-indigo-900 via-purple-900 to-indigo-900',
      accent: 'indigo',
      text: 'from-indigo-300 to-purple-300',
      glow: 'indigo-400'
    },
    mosqueStyle: 'starlit',
    badge: 'MAGICAL',
    features: [
      'Deep indigo night sky',
      'Thousands of twinkling stars',
      'Shooting star effects',
      'Mosque silhouette',
      'Magical family memories'
    ],
    recommendedFor: 'Families who love starry nights and magic'
  }
];

// Helper function to get pack by ID
export const getFamilyPackById = (id) => {
  return familyPacks.find(pack => pack.id === id);
};

// Get featured packs (for homepage)
export const featuredFamilyPacks = familyPacks.filter(pack => 
  pack.id === 'family-sample-premium' || 
  pack.id === 'family-gold-heritage' || 
  pack.id === 'family-pearl-white'
);