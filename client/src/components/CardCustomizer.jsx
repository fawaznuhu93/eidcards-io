import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import PaymentButton from './PaymentButton';
import ScreenshotBlocker from './ScreenshotBlocker';

export default function CardCustomizer({ card, type = 'individual' }) {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    senderName: '',
    recipientName: '',
    message: '',
    email: '', // ✅ Added email field
    quantity: 1,
    cards: []
  });
  const [previewCard, setPreviewCard] = useState(null);
  const [emailError, setEmailError] = useState('');

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handlePersonalize = () => {
    // Validate email
    if (!formData.email) {
      setEmailError(language === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب');
      return;
    }
    if (!validateEmail(formData.email)) {
      setEmailError(language === 'en' ? 'Please enter a valid email' : 'الرجاء إدخال بريد إلكتروني صحيح');
      return;
    }
    
    setPreviewCard({
      ...card,
      senderName: formData.senderName,
      message: formData.message,
      email: formData.email
    });
    setStep(2);
  };

  // For family pack
  if (type === 'family') {
    return <FamilyPackCustomizer card={card} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Customization Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-3xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6 gold-text">
            {language === 'en' ? 'Personalize Your Card' : 'خصص بطاقتك'}
          </h2>
          
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* ✅ NEW: Email Field - REQUIRED */}
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
                      setEmailError('');
                    }}
                    placeholder={language === 'en' ? 'your@email.com' : 'بريدك@الإلكتروني.com'}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      emailError ? 'border-red-500' : 'border-gray-200'
                    } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
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
                    onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                    placeholder={language === 'en' ? 'e.g., Ahmed' : 'مثلاً: أحمد'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    required
                  />
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
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Your Message' : 'رسالتك'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder={language === 'en' 
                      ? 'Eid Mubarak! May your day be blessed...' 
                      : 'عيد مبارك! تقبل الله منا ومنكم...'}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePersonalize}
                  disabled={!formData.senderName || !formData.message || !formData.email}
                  className="w-full py-4 bg-gradient-to-r from-gold to-amber-500 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {language === 'en' ? '👀 Preview Card' : '👀 معاينة البطاقة'}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="payment"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    {language === 'en' ? 'Preview Ready!' : 'المعاينة جاهزة!'}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {language === 'en'
                      ? 'Your card looks beautiful! Complete payment to download.'
                      : 'بطاقتك تبدو جميلة! أكمل الدفع للتحميل.'}
                  </p>
                  <p className="text-sm text-gray-500">
                    📧 Receipt will be sent to: {formData.email}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">{language === 'en' ? 'Total:' : 'المجموع:'}</span>
                    <span className="text-3xl font-bold gold-text">${card.price}</span>
                  </div>

                  <PaymentButton
                    product={card}
                    formData={formData}
                    type={type}
                  />
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gold hover:underline"
                >
                  ← {language === 'en' ? 'Edit details' : 'تعديل التفاصيل'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right: Live Preview (unchanged) */}
        {/* ... rest of the preview code remains the same ... */}
      </div>
    </div>
  );
}

// Family Pack Customizer Component - also needs email field
const FamilyPackCustomizer = ({ card }) => {
  const { t, language } = useLanguage();
  const [quantity, setQuantity] = useState(2);
  const [email, setEmail] = useState(''); // ✅ Added email
  const [emailError, setEmailError] = useState('');
  const [cards, setCards] = useState([
    { senderName: '', recipientName: '', message: '' },
    { senderName: '', recipientName: '', message: '' }
  ]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handlePayment = () => {
    if (!email) {
      setEmailError(language === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب');
      return false;
    }
    if (!validateEmail(email)) {
      setEmailError(language === 'en' ? 'Please enter a valid email' : 'الرجاء إدخال بريد إلكتروني صحيح');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (quantity > cards.length) {
      setCards([
        ...cards,
        ...Array(quantity - cards.length).fill().map(() => ({
          senderName: '', recipientName: '', message: ''
        }))
      ]);
    } else if (quantity < cards.length) {
      setCards(cards.slice(0, quantity));
    }
  }, [quantity]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-effect rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-6 gold-text">
          {language === 'en' ? '👨‍👩‍👧 Family Pack' : '👨‍👩‍👧 باقة عائلية'}
        </h2>

        {/* ✅ Email Field for Family Pack */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Your Email' : 'بريدك الإلكتروني'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            placeholder={language === 'en' ? 'your@email.com' : 'بريدك@الإلكتروني.com'}
            className={`w-full px-4 py-3 rounded-xl border ${
              emailError ? 'border-red-500' : 'border-gray-200'
            } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
            required
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'How many cards? (2-5)' : 'كم بطاقة؟ (٥-٢)'}
          </label>
          <div className="flex gap-2">
            {[2,3,4,5].map(num => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuantity(num)}
                className={`w-16 h-16 rounded-2xl font-bold text-xl transition-all ${
                  quantity === num
                    ? 'bg-gold text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-gold/20'
                }`}
              >
                {num}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Individual Card Forms */}
        <div className="space-y-8 mb-8">
          {cards.map((cardData, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white/50 rounded-2xl border border-gold/20"
            >
              <h3 className="text-xl font-bold mb-4">
                {language === 'en' ? `Card ${index + 1}` : `بطاقة ${index + 1}`}
              </h3>
              
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Your Name' : 'اسمك'}
                  value={cardData.senderName}
                  onChange={(e) => {
                    const newCards = [...cards];
                    newCards[index].senderName = e.target.value;
                    setCards(newCards);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:border-gold outline-none"
                />
                
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Recipient Name' : 'اسم المستلم'}
                  value={cardData.recipientName}
                  onChange={(e) => {
                    const newCards = [...cards];
                    newCards[index].recipientName = e.target.value;
                    setCards(newCards);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:border-gold outline-none"
                />
                
                <textarea
                  placeholder={language === 'en' ? 'Message' : 'الرسالة'}
                  value={cardData.message}
                  onChange={(e) => {
                    const newCards = [...cards];
                    newCards[index].message = e.target.value;
                    setCards(newCards);
                  }}
                  rows="2"
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:border-gold outline-none resize-none"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total and Payment */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold gold-text">
              {language === 'en' ? 'Total:' : 'المجموع:'}
            </span>
            <span className="text-4xl font-bold gold-text">$15</span>
          </div>

          <PaymentButton
            product={{ ...card, price: 15 }}
            formData={{ cards, quantity, email }}
            type="family"
            onBeforePayment={handlePayment}
          />
        </div>
      </div>
    </div>
  );
};