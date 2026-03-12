import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import PaymentButton from '../components/PaymentButton';
import ScreenshotBlocker from '../components/ScreenshotBlocker';
import LockOverlay from '../components/LockOverlay';
import { premiumCards } from '../data/premiumCards';
import { trackCustomization } from '../utils/analytics';

// When user clicks customize:
const handleCustomize = () => {
  trackCustomization(card.type, card.name);
  // ... rest of your code
};
export default function CardCustomizePage() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  
  const [card, setCard] = useState(null);
  const [formData, setFormData] = useState({
    senderName: '',
    recipientName: '',
    message: '',
    email: ''
  });
  const [step, setStep] = useState(1); // 1: form, 2: preview (LOCKED), 3: payment (UNLOCKED)
  const [formErrors, setFormErrors] = useState({});

  // Find the card by ID
  useEffect(() => {
    console.log('Looking for card with ID:', cardId);
    const foundCard = premiumCards.find(c => c.id === cardId);
    
    if (foundCard) {
      console.log('Card found:', foundCard.name);
      setCard(foundCard);
    } else {
      console.log('Card not found, redirecting to /individual');
      navigate('/individual');
    }
  }, [cardId, navigate]);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl gold-text">Loading...</div>
      </div>
    );
  }

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = language === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = language === 'en' ? 'Invalid email format' : 'صيغة البريد الإلكتروني غير صحيحة';
    }
    
    if (!formData.senderName) {
      errors.senderName = language === 'en' ? 'Your name is required' : 'اسمك مطلوب';
    }
    
    if (!formData.message) {
      errors.message = language === 'en' ? 'Message is required' : 'الرسالة مطلوبة';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) {
      setStep(2); // Move to preview (LOCKED)
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleProceedToPayment = () => {
    setStep(3); // Move to payment (UNLOCKED)
  };

  // Check if this is the sample card
  const isSampleCard = card.id === 'sample-premium';

  // Get color scheme from card
  const colorScheme = card.colorScheme || {
    bg: 'from-gray-900 via-gray-800 to-gray-900',
    accent: 'gold',
    glow: 'amber-500',
    text: 'from-gold to-amber-500'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-gold text-white' : 'bg-gray-200'
            }`}>1</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-gold' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-gold text-white' : 'bg-gray-200'
            }`}>2</div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-gold' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-gold text-white' : 'bg-gray-200'
            }`}>3</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Form/Payment */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-3xl p-6 md:p-8"
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold gold-text mb-6">
                  {language === 'en' ? 'Personalize Your Card' : 'خصص بطاقتك'}
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Your Email' : 'بريدك الإلكتروني'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      setFormErrors({...formErrors, email: ''});
                    }}
                    placeholder={language === 'en' ? 'your@email.com' : 'بريدك@الإلكتروني.com'}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-200'
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Your Name' : 'اسمك'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => {
                      setFormData({...formData, senderName: e.target.value});
                      setFormErrors({...formErrors, senderName: ''});
                    }}
                    placeholder={language === 'en' ? 'e.g., Ahmed' : 'مثلاً: أحمد'}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      formErrors.senderName ? 'border-red-500' : 'border-gray-200'
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                    required
                  />
                  {formErrors.senderName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.senderName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Recipient Name' : 'اسم المستلم'}
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                    placeholder={language === 'en' ? 'e.g., Fatima' : 'مثلاً: فاطمة'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Your Message' : 'رسالتك'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({...formData, message: e.target.value});
                      setFormErrors({...formErrors, message: ''});
                    }}
                    placeholder={language === 'en' 
                      ? 'Eid Mubarak! May your day be blessed...' 
                      : 'عيد مبارك! تقبل الله منا ومنكم...'}
                    rows="4"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      formErrors.message ? 'border-red-500' : 'border-gray-200'
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none`}
                    required
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePreview}
                  className="w-full py-4 bg-gradient-to-r from-gold to-amber-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {language === 'en' ? '👀 Preview Card' : '👀 معاينة البطاقة'}
                </motion.button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold gold-text mb-6">
                  {language === 'en' ? 'Preview Your Card' : 'معاينة بطاقتك'}
                </h2>
                
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-green-700 font-medium">
                    {language === 'en' 
                      ? '✨ Your card is ready! Review it below.' 
                      : '✨ بطاقتك جاهزة! راجعها أدناه.'}
                  </p>
                </div>

                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-sm text-amber-700">
                    <span className="font-bold">Email:</span> {formData.email}<br />
                    <span className="font-bold">{language === 'en' ? 'From:' : 'من:'}</span> {formData.senderName}<br />
                    {formData.recipientName && (
                      <><span className="font-bold">{language === 'en' ? 'To:' : 'إلى:'}</span> {formData.recipientName}<br /></>
                    )}
                    <span className="font-bold">{language === 'en' ? 'Message:' : 'الرسالة:'}</span> "{formData.message}"
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleBack}
                    className="text-gold hover:underline"
                  >
                    ← {language === 'en' ? 'Edit Details' : 'تعديل التفاصيل'}
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToPayment}
                    className="w-full py-4 bg-gradient-to-r from-gold to-amber-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    {language === 'en' ? '💳 Proceed to Payment' : '💳 المتابعة للدفع'}
                  </motion.button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold gold-text mb-6">
                  {language === 'en' ? 'Complete Payment' : 'إتمام الدفع'}
                </h2>
                
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-blue-700 text-center">
                    {language === 'en'
                      ? 'You are purchasing:'
                      : 'أنت تشتري:'}
                  </p>
                  <p className="font-bold text-center mt-2">{card.name}</p>
                  <p className="text-center text-sm text-gray-600 mt-1">
                    ${card.price} • {card.description}
                  </p>
                </div>

                <PaymentButton
                  product={card}
                  formData={formData}
                  type="individual"
                />

                <button
                  onClick={handleBack}
                  className="text-sm text-gold hover:underline w-full text-center"
                >
                  ← {language === 'en' ? 'Go Back' : 'العودة'}
                </button>
              </div>
            )}
          </motion.div>

          {/* Right: Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            <ScreenshotBlocker>
              <div className="relative max-w-sm mx-auto">
                {/* Glow effect - using card's color scheme */}
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
                  className={`absolute inset-[-15px] bg-gradient-to-r from-${colorScheme.accent}/30 via-${colorScheme.glow}/30 to-${colorScheme.accent}/30 rounded-[30px] blur-2xl`}
                />
                
                {/* Main Card - Using card's design */}
                <div 
                  className={`relative bg-gradient-to-br ${colorScheme.bg} rounded-2xl p-1 shadow-2xl`}
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.accent}40, ${colorScheme.glow}60, ${colorScheme.accent}40)`
                  }}
                >
                  <div className={`relative bg-gradient-to-br ${colorScheme.bg} rounded-2xl overflow-hidden`}>
                    
                    {/* Islamic geometric pattern overlay */}
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 5 L75 40 L40 75 L5 40 Z' fill='none' stroke='%23${colorScheme.accent === 'gold' ? 'FFD700' : 'FFFFFF'}' stroke-width='1'/%3E%3Cpath d='M40 20 L60 40 L40 60 L20 40 Z' fill='none' stroke='%23${colorScheme.accent === 'gold' ? 'FFD700' : 'FFFFFF'}' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='40' r='12' fill='none' stroke='%23${colorScheme.accent === 'gold' ? 'FFD700' : 'FFFFFF'}' stroke-width='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '120px 120px',
                        backgroundPosition: 'center',
                      }}
                    />

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
                      className="absolute inset-[-50%] bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      style={{
                        transformOrigin: 'center',
                      }}
                    />

                    {/* Card content */}
                    <div className="relative z-10 p-6">
                      
                      {/* Top decorative border - using gold */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold via-amber-500 to-gold" />
                      
                      {/* Corner decorations */}
                      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gold/20 rounded-bl-full" />
                        <div className="absolute top-1 right-1 w-6 h-6 bg-gold/30 rounded-full animate-pulse" />
                      </div>
                      <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                        <div className="absolute top-0 left-0 w-8 h-8 bg-gold/20 rounded-br-full" />
                        <div className="absolute top-1 left-1 w-6 h-6 bg-gold/30 rounded-full animate-pulse delay-1000" />
                      </div>

                      {/* MOSQUE - Using card's mosque style */}
                      <div className="relative h-28 mb-4 flex justify-center items-center">
                        {card.mosqueStyle === 'ottoman' && (
                          <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="relative scale-90"
                          >
                            <div className="relative">
                              <div className={`w-20 h-14 bg-gradient-to-b from-${colorScheme.accent} to-${colorScheme.glow} rounded-t-full mx-auto`} />
                              <div className={`w-14 h-6 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.glow} rounded-b-full mx-auto -mt-2`} />
                              <div className={`w-3 h-10 bg-${colorScheme.accent}/80 mx-auto -mt-2 rounded-t-full`} />
                            </div>
                            <div className="absolute -left-12 top-6">
                              <div className={`w-3 h-16 bg-gradient-to-t from-${colorScheme.accent}/80 to-${colorScheme.accent}/40 rounded-t-full`} />
                            </div>
                            <div className="absolute -right-12 top-6">
                              <div className={`w-3 h-16 bg-gradient-to-t from-${colorScheme.accent}/80 to-${colorScheme.accent}/40 rounded-t-full`} />
                            </div>
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0], y: [0, -3, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl"
                            >
                              🌙
                            </motion.div>
                          </motion.div>
                        )}

                        {card.mosqueStyle === 'andalusian' && (
                          <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="relative scale-90"
                          >
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="relative">
                                  <div className={`w-6 h-10 border-2 border-${colorScheme.accent} rounded-t-full`} />
                                  <div className={`w-4 h-4 bg-${colorScheme.accent}/20 absolute top-2 left-1 rounded-t-full`} />
                                </div>
                              ))}
                            </div>
                            <div className="absolute -right-12 -top-2">
                              <div className={`w-3 h-16 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40`} />
                            </div>
                          </motion.div>
                        )}

                        {card.mosqueStyle === 'persian' && (
                          <motion.div
                            animate={{ skewX: [0, 2, -2, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="relative scale-90"
                          >
                            <div className={`w-24 h-14 bg-gradient-to-b from-${colorScheme.accent} to-${colorScheme.glow} rounded-t-full`} />
                            <div className="absolute -left-8 -top-2">
                              <div className={`w-2 h-16 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40`} />
                            </div>
                            <div className="absolute -right-8 -top-2">
                              <div className={`w-2 h-16 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40`} />
                            </div>
                          </motion.div>
                        )}

                        {card.mosqueStyle === 'moroccan' && (
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="relative scale-90"
                          >
                            <div className={`w-12 h-20 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40 relative`}>
                              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 grid grid-cols-2 gap-1">
                                <div className="w-2 h-2 border border-white/60" />
                                <div className="w-2 h-2 border border-white/60" />
                              </div>
                            </div>
                            <div className={`w-16 h-2 bg-${colorScheme.accent}/60 -mt-1 -ml-2`} />
                          </motion.div>
                        )}

                        {card.mosqueStyle === 'mughal' && (
                          <motion.div
                            animate={{ rotateY: [0, 10, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="relative scale-90"
                          >
                            <div className="flex gap-2">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="relative">
                                  <div className={`w-8 h-10 bg-gradient-to-b from-${colorScheme.accent} to-${colorScheme.glow} rounded-t-full`} />
                                  {i === 1 && <div className={`w-1 h-4 bg-${colorScheme.accent} mx-auto`} />}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {card.mosqueStyle === 'modern' && (
                          <motion.div
                            animate={{ scaleX: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="relative scale-90"
                          >
                            <div className="flex items-end gap-1">
                              <div className={`w-4 h-12 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40 rounded-t-lg`} />
                              <div className={`w-6 h-16 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/60 rounded-t-lg`} />
                              <div className={`w-4 h-12 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40 rounded-t-lg`} />
                            </div>
                            <div className={`w-16 h-1 bg-${colorScheme.accent}/60 mx-auto mt-1`} />
                          </motion.div>
                        )}

                        {card.mosqueStyle === 'arabian' && (
                          <motion.div
                            animate={{ rotate: [0, 1, -1, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="relative scale-90"
                          >
                            <div className="flex gap-4">
                              <div className={`w-2 h-16 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40`} />
                              <div className={`w-10 h-12 bg-gradient-to-b from-${colorScheme.accent} to-${colorScheme.glow} rounded-t-full`} />
                              <div className={`w-2 h-16 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40`} />
                            </div>
                          </motion.div>
                        )}

                        {card.mosqueStyle === 'seljuk' && (
                          <motion.div
                            animate={{ skewY: [0, 2, -2, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="relative scale-90"
                          >
                            <div className={`w-16 h-12 bg-gradient-to-b from-${colorScheme.accent} to-${colorScheme.glow} rounded-t-full`} />
                            <div className="flex justify-between w-20 mx-auto -mt-4">
                              <div className={`w-2 h-12 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40`} />
                              <div className={`w-2 h-12 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40`} />
                            </div>
                          </motion.div>
                        )}

                        {card.mosqueStyle === 'starlit' && (
                          <motion.div
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="relative scale-90"
                          >
                            <div className={`w-20 h-14 bg-gradient-to-b from-${colorScheme.accent} to-${colorScheme.glow} rounded-t-full`} />
                            <div className="absolute -left-4 -top-2">
                              <div className={`w-2 h-12 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40`} />
                            </div>
                            <div className="absolute -right-4 -top-2">
                              <div className={`w-2 h-12 bg-gradient-to-t from-${colorScheme.accent} to-${colorScheme.accent}/40`} />
                            </div>
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                                className="absolute text-gold text-xs"
                                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                              >
                                ✦
                              </motion.div>
                            ))}
                          </motion.div>
                        )}

                        {/* Default fallback */}
                        {!card.mosqueStyle && (
                          <div className="text-5xl">🕌</div>
                        )}
                      </div>

                      {/* EID MUBARAK TEXT - Always gold */}
                      <motion.h2
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-4xl font-bold text-center mb-3"
                      >
                        <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">
                          {language === 'en' ? 'EID MUBARAK' : 'عيد مبارك'}
                        </span>
                      </motion.h2>

                      {/* Decorative line - Gold */}
                      <div className="flex justify-center items-center gap-1 mb-6">
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

                      {/* TOP RIGHT - User's name in GOLD (premium look) */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gold/80 mb-1 tracking-wide">
                            {language === 'en' ? 'FROM' : 'من'}
                          </p>
                          <div className="flex items-center gap-1 justify-end">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-1.5 h-1.5 bg-gold rounded-full"
                            />
                            <p className="text-base md:text-lg font-bold bg-gradient-to-r from-gold to-amber-400 bg-clip-text text-transparent">
                              {step >= 2 ? formData.senderName : (step === 1 ? '' : 'Your Name')}
                            </p>
                          </div>
                          {step === 1 && (
                            <p className="text-[8px] text-gold/50 mt-1 italic font-medium">
                              {language === 'en' ? '(Your name in gold)' : '(اسمك بالذهب)'}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* MESSAGE SECTION - Black text for better readability */}
                      <div className="relative py-4 px-2 mt-12">
                        {/* Decorative borders - Gold */}
                        <div className="absolute left-0 top-1/2 w-8 h-px bg-gradient-to-r from-transparent to-gold/50" />
                        <div className="absolute right-0 top-1/2 w-8 h-px bg-gradient-to-l from-transparent to-gold/50" />
                        
                        {/* Message - Black text */}
                        <motion.p 
                          animate={{ 
                            textShadow: [
                              '0 2px 4px rgba(0,0,0,0.1)',
                              '0 4px 8px rgba(0,0,0,0.2)',
                              '0 2px 4px rgba(0,0,0,0.1)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-sm md:text-base text-center leading-relaxed text-gray-900 font-medium px-2 bg-white/30 backdrop-blur-sm py-2 rounded-lg"
                        >
                          {step >= 2 ? formData.message : (step === 1 ? '' : 'Eid Mubarak! May your Eid be blessed and joyous 🌙')}
                        </motion.p>
                        {step === 1 && (
                          <p className="text-[8px] text-gray-600 text-center mt-1 italic font-medium">
                            {language === 'en' ? '(Your message in black)' : '(رسالتك بالأسود)'}
                          </p>
                        )}
                      </div>

                      {/* BOTTOM DECORATIONS - Gold */}
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                              className="w-1 h-1 bg-gold rounded-full"
                            />
                          ))}
                        </div>

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

                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, delay: 2 - i * 0.3, repeat: Infinity }}
                              className="w-1 h-1 bg-gold rounded-full"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Bottom calligraphy - Gold */}
                      <div className="mt-4 pt-3 border-t border-gold/20">
                        <p className="text-center text-[10px] text-gold/60 font-arabic font-bold">
                          {language === 'en' ? '✨ تقبل الله طاعتكم ✨' : '✨ May Allah accept your deeds ✨'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🔒 LOCK OVERLAY - Only shows in step 2 (after clicking Preview Card) */}
                {step === 2 && (
                  <LockOverlay show={true} />
                )}

                {/* Watermark for preview - Only in step 1 (optional) */}
                {step === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <p className="text-2xl font-bold text-gold transform rotate-30">
                      🔒 PREVIEW
                    </p>
                  </div>
                )}
              </div>
            </ScreenshotBlocker>

            <p className="text-center text-sm text-gray-500 mt-4">
              ⚡ {language === 'en' 
                ? step === 2 
                  ? '🔒 Card is locked in preview - Complete payment to unlock' 
                  : 'Your name in gold at top-right, message in black'
                : step === 2
                  ? '🔒 البطاقة مقفلة في المعاينة - أكمل الدفع لإلغاء القفل'
                  : 'اسمك بالذهب في أعلى اليمين، الرسالة بالأسود'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}