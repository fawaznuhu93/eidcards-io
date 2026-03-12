// 🔴 CRITICAL: Backend source of truth for prices
// NEVER trust frontend price data!

const PRICES = {
  // Individual Cards
  individual: {
    'gold-imperial': 500,      // $5.00
    'emerald-elegance': 500,    // $5.00
    'royal-sapphire': 500,      // $5.00
    'ruby-rose': 500,           // $5.00
    'amethyst-dream': 500,      // $5.00
    'diamond-pearl': 500,       // $5.00
    'desert-sunset': 500,       // $5.00
    'midnight-ocean': 500,      // $5.00
    'copper-antique': 500,      // $5.00
    'sapphire-night': 500,      // $5.00
    'pink-rose': 500,           // $5.00
    'blush-pink': 500,          // $5.00
    'elegant-grey': 500,        // $5.00
    'silver-grey': 500,         // $5.00
    'sunset-orange': 500,       // $5.00
    'coral-orange': 500,        // $5.00
    'sample-premium': 500       // $5.00
  },
  
  // Video Cards
  video: {
    'video-gold-luxury': 1000,      // $10.00
    'video-gold-crescent': 1000,    // $10.00
    'video-emerald-elegance': 1000,  // $10.00
    'video-emerald-sparkle': 1000,   // $10.00
    'video-sapphire-night': 1000,    // $10.00
    'video-sapphire-waves': 1000,    // $10.00
    'video-ruby-passion': 1000,      // $10.00
    'video-ruby-heart': 1000,        // $10.00
    'video-purple-royal': 1000,      // $10.00
    'video-purple-mystic': 1000,     // $10.00
    'video-pink-blossom': 1000,      // $10.00
    'video-pink-rose': 1000,         // $10.00
    'video-orange-sunset': 1000,     // $10.00
    'video-orange-fire': 1000,       // $10.00
    'video-silver-elegance': 1000,   // $10.00
    'video-silver-sparkle': 1000,    // $10.00
    'video-eid-mubarak': 1000        // $10.00
  },
  
  // Family Packs
  family: {
    'family-sample-premium': 1500,    // $15.00
    'family-silver-elegance': 1500,   // $15.00
    'family-gold-heritage': 1500,     // $15.00
    'family-pearl-white': 1500,       // $15.00
    'family-emerald-royal': 1500,     // $15.00
    'family-sapphire-night': 1500,    // $15.00
    'family-ruby-passion': 1500,      // $15.00
    'family-purple-royal': 1500,      // $15.00
    'family-pink-blossom': 1500,      // $15.00
    'family-orange-sunset': 1500,     // $15.00
    'family-copper-antique': 1500,    // $15.00
    'family-starlit-night': 1500      // $15.00
  }
};

// Product type mapping
const PRODUCT_TYPES = {
  // Individual cards
  'gold-imperial': 'individual',
  'emerald-elegance': 'individual',
  'royal-sapphire': 'individual',
  'ruby-rose': 'individual',
  'amethyst-dream': 'individual',
  'diamond-pearl': 'individual',
  'desert-sunset': 'individual',
  'midnight-ocean': 'individual',
  'copper-antique': 'individual',
  'sapphire-night': 'individual',
  'pink-rose': 'individual',
  'blush-pink': 'individual',
  'elegant-grey': 'individual',
  'silver-grey': 'individual',
  'sunset-orange': 'individual',
  'coral-orange': 'individual',
  'sample-premium': 'individual',
  
  // Video cards
  'video-gold-luxury': 'video',
  'video-gold-crescent': 'video',
  'video-emerald-elegance': 'video',
  'video-emerald-sparkle': 'video',
  'video-sapphire-night': 'video',
  'video-sapphire-waves': 'video',
  'video-ruby-passion': 'video',
  'video-ruby-heart': 'video',
  'video-purple-royal': 'video',
  'video-purple-mystic': 'video',
  'video-pink-blossom': 'video',
  'video-pink-rose': 'video',
  'video-orange-sunset': 'video',
  'video-orange-fire': 'video',
  'video-silver-elegance': 'video',
  'video-silver-sparkle': 'video',
  'video-eid-mubarak': 'video',
  
  // Family packs
  'family-sample-premium': 'family',
  'family-silver-elegance': 'family',
  'family-gold-heritage': 'family',
  'family-pearl-white': 'family',
  'family-emerald-royal': 'family',
  'family-sapphire-night': 'family',
  'family-ruby-passion': 'family',
  'family-purple-royal': 'family',
  'family-pink-blossom': 'family',
  'family-orange-sunset': 'family',
  'family-copper-antique': 'family',
  'family-starlit-night': 'family'
};

// Get expected amount for a product
const getExpectedAmount = (productId, productType) => {
  // First try by product ID
  if (PRICES[productType] && PRICES[productType][productId]) {
    return PRICES[productType][productId];
  }
  
  // Fallback to type-based pricing
  switch(productType) {
    case 'individual': return 500;
    case 'video': return 1000;
    case 'family': return 1500;
    default: return null;
  }
};

module.exports = {
  PRICES,
  PRODUCT_TYPES,
  getExpectedAmount
};