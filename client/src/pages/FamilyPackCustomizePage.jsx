import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import PaymentButton from '../components/PaymentButton';
import ScreenshotBlocker from '../components/ScreenshotBlocker';
import FamilyPackCard from '../components/FamilyPackCard';
import { familyPacks } from '../data/familyPacks';

export default function FamilyPackCustomizePage() {
  const { packId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [pack, setPack] = useState(null);
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(2);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardErrors, setCardErrors] = useState({});

  useEffect(() => {
    const foundPack = familyPacks.find(p => p.id === packId);
    if (foundPack) {
      setPack(foundPack);
    } else {
      navigate('/family');
    }
  }, [packId, navigate]);

  useEffect(() => {
    if (pack) {
      const newCards = Array(quantity).fill().map((_, i) => 
        cards[i] || { senderName: '', recipientName: '', message: '' }
      );
      setCards(newCards);
    }
  }, [quantity, pack]);

  if (!pack) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl gold-text">Loading...</div>
      </div>
    );
  }

  const validateEmail = () => {
    if (!email) {
      setEmailError(language === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(language === 'en' ? 'Invalid email format' : 'صيغة البريد الإلكتروني غير صحيحة');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleQuantityNext = () => {
    if (validateEmail()) {
      setStep(2);
    }
  };

  const validateCurrentCard = () => {
    const errors = {};
    const currentCard = cards[currentCardIndex];
    
    if (!currentCard?.senderName) {
      errors.senderName = language === 'en' ? 'Name is required' : 'الاسم مطلوب';
    }
    if (!currentCard?.message) {
      errors.message = language === 'en' ? 'Message is required' : 'الرسالة مطلوبة';
    }
    
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardNext = () => {
    if (validateCurrentCard()) {
      if (currentCardIndex < quantity - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setCardErrors({});
      } else {
        setStep(3);
      }
    }
  };

  const handleCardBack = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setCardErrors({});
    } else {
      setStep(1);
    }
  };

  const handlePreviewBack = () => {
    setStep(2);
    setCurrentCardIndex(quantity - 1);
  };

  const handleProceedToPayment = () => {
    setStep(4);
  };

  const updateCurrentCard = (field, value) => {
    const newCards = [...cards];
    newCards[currentCardIndex] = {
      ...newCards[currentCardIndex],
      [field]: value
    };
    setCards(newCards);
    if (cardErrors[field]) {
      const newErrors = { ...cardErrors };
      delete newErrors[field];
      setCardErrors(newErrors);
    }
  };

  // Function to download all cards
  const downloadAllCards = () => {
    // This will be triggered after payment
    cards.forEach((card, index) => {
      // Create a canvas for each card
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      
      // Draw card background based on pack color scheme
      ctx.fillStyle = pack.colorScheme.bg.includes('gray') ? '#1F2937' : '#4B3B2A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add Islamic pattern
      ctx.fillStyle = 'rgba(255,215,0,0.1)';
      for (let i = 0; i < canvas.width; i += 40) {
        for (let j = 0; j < canvas.height; j += 40) {
          ctx.beginPath();
          ctx.moveTo(i, j);
          ctx.lineTo(i + 20, j + 20);
          ctx.strokeStyle = 'rgba(255,215,0,0.2)';
          ctx.stroke();
        }
      }
      
      // Draw mosque (simplified)
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(400, 200, 60, 0, Math.PI, true);
      ctx.fill();
      ctx.fillRect(360, 140, 80, 60);
      
      // Draw Eid Mubarak
      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.textAlign = 'center';
      ctx.fillText('EID MUBARAK', 400, 350);
      
      // Draw sender name (top right)
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`From: ${card.senderName}`, 750, 80);
      
      // Draw message (centered)
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      
      // Wrap text
      const words = card.message.split(' ');
      let line = '';
      let y = 500;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > 500 && i > 0) {
          ctx.fillText(line, 400, y);
          line = words[i] + ' ';
          y += 40;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 400, y);
      
      // Draw recipient if exists
      if (card.recipientName) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`→ ${card.recipientName}`, 400, y + 50);
      }
      
      // Trigger download
      const link = document.createElement('a');
      link.download = `EidCard_${card.senderName}_${index + 1}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
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
            <div className={`w-16 h-1 ${step >= 4 ? 'bg-gold' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 4 ? 'bg-gold text-white' : 'bg-gray-200'
            }`}>4</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Form */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-3xl p-6 md:p-8"
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold gold-text mb-6">
                  {language === 'en' ? 'Family Pack Setup' : 'إعداد الباقة العائلية'}
                </h2>
                
                <div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Number of Cards (2-5)' : 'عدد البطاقات (٥-٢)'}
                  </label>
                  <div className="flex gap-3">
                    {[2,3,4,5].map(num => (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuantity(num)}
                        className={`w-16 h-16 rounded-xl font-bold text-xl transition-all ${
                          quantity === num
                            ? 'bg-gold text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gold/20'
                        }`}
                      >
                        {num}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQuantityNext}
                  className="w-full py-4 bg-gradient-to-r from-gold to-amber-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {language === 'en' ? '👉 Next: Personalize Cards' : '👉 التالي: تخصيص البطاقات'}
                </motion.button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl md:text-3xl font-bold gold-text">
                    {language === 'en' ? `Card ${currentCardIndex + 1} of ${quantity}` : `بطاقة ${currentCardIndex + 1} من ${quantity}`}
                  </h2>
                  <span className="text-sm bg-gold/10 px-3 py-1 rounded-full">
                    {Math.round(((currentCardIndex + 1) / quantity) * 100)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentCardIndex + 1) / quantity) * 100}%` }}
                    className="bg-gold h-2 rounded-full"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Your Name' : 'اسمك'}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={cards[currentCardIndex]?.senderName || ''}
                      onChange={(e) => updateCurrentCard('senderName', e.target.value)}
                      placeholder={language === 'en' ? 'e.g., Ahmed' : 'مثلاً: أحمد'}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        cardErrors.senderName ? 'border-red-500' : 'border-gray-200'
                      } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                    />
                    {cardErrors.senderName && (
                      <p className="text-red-500 text-sm mt-1">{cardErrors.senderName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Recipient Name' : 'اسم المستلم'}
                    </label>
                    <input
                      type="text"
                      value={cards[currentCardIndex]?.recipientName || ''}
                      onChange={(e) => updateCurrentCard('recipientName', e.target.value)}
                      placeholder={language === 'en' ? 'e.g., Fatima' : 'مثلاً: فاطمة'}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Message' : 'الرسالة'}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      value={cards[currentCardIndex]?.message || ''}
                      onChange={(e) => updateCurrentCard('message', e.target.value)}
                      placeholder={language === 'en' ? 'Eid Mubarak! Wishing you and your family joy and blessings.' : 'عيد مبارك! أتمنى لك ولعائلتك الفرح والبركات'}
                      rows="3"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        cardErrors.message ? 'border-red-500' : 'border-gray-200'
                      } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none`}
                    />
                    {cardErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{cardErrors.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCardBack}
                    className="flex-1 py-3 border-2 border-gold text-gold rounded-xl font-semibold hover:bg-gold/10 transition-colors"
                  >
                    ← {language === 'en' ? 'Back' : 'رجوع'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCardNext}
                    className="flex-1 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-dark transition-colors"
                  >
                    {currentCardIndex === quantity - 1 
                      ? (language === 'en' ? 'Preview Pack →' : 'معاينة الباقة ←')
                      : (language === 'en' ? 'Next Card →' : 'البطاقة التالية ←')
                    }
                  </motion.button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold gold-text mb-6">
                  {language === 'en' ? 'Preview Your Family Pack' : 'معاينة الباقة العائلية'}
                </h2>
                
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-green-700 font-medium">
                    {language === 'en' 
                      ? `✨ ${quantity} cards ready for ${email}!` 
                      : `✨ ${quantity} بطاقات جاهزة لـ ${email}!`}
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handlePreviewBack}
                    className="text-gold hover:underline"
                  >
                    ← {language === 'en' ? 'Edit Cards' : 'تعديل البطاقات'}
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

            {step === 4 && (
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
                  <p className="font-bold text-center mt-2">{pack.name}</p>
                  <p className="text-center text-sm text-gray-600 mt-1">
                    {quantity} {language === 'en' ? 'personalized cards' : 'بطاقات مخصصة'} • ${pack.price}
                  </p>
                </div>

                <PaymentButton
                  product={{ ...pack, price: 15 }}
                  formData={{ email, cards, quantity }}
                  type="family"
                  onSuccess={downloadAllCards} // Auto-download after payment
                />

                <button
                  onClick={handlePreviewBack}
                  className="text-sm text-gold hover:underline w-full text-center"
                >
                  ← {language === 'en' ? 'Go Back' : 'العودة'}
                </button>
              </div>
            )}
          </motion.div>

          {/* Right: Preview - Side by Side Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            <ScreenshotBlocker>
              <div className="relative">
                {step === 1 && (
                  // Step 1: Show single pack card
                  <FamilyPackCard pack={pack} />
                )}

                {step === 2 && (
                  // Step 2: Show current card being edited
                  <FamilyPackCard 
                    pack={pack} 
                    showPreview={true}
                    cards={cards}
                    cardIndex={currentCardIndex}
                  />
                )}

                {step === 3 && (
                  // Step 3: Show ALL cards side by side
                  <div className="space-y-4">
                    <h3 className="text-sm text-gold text-center">
                      {language === 'en' ? 'Your Family Cards:' : 'بطاقات عائلتك:'}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto p-2">
                      {cards.map((card, idx) => (
                        <FamilyPackCard 
                          key={idx}
                          pack={pack} 
                          showPreview={true}
                          cards={cards}
                          cardIndex={idx}
                          isSmall={true}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      {language === 'en' 
                        ? `${quantity} cards ready • Complete payment to download all` 
                        : `${quantity} بطاقات جاهزة • أكمل الدفع لتحميل الكل`}
                    </p>
                  </div>
                )}

                {step === 4 && (
                  // Step 4: Show all cards (about to download)
                  <div className="space-y-4">
                    <h3 className="text-sm text-gold text-center">
                      {language === 'en' ? 'Your Cards (Ready for Download):' : 'بطاقاتك (جاهزة للتحميل):'}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto p-2">
                      {cards.map((card, idx) => (
                        <FamilyPackCard 
                          key={idx}
                          pack={pack} 
                          showPreview={true}
                          cards={cards}
                          cardIndex={idx}
                          isSmall={true}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Watermark */}
                {step < 4 && (
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
                ? 'Preview mode • Purchase to download all cards instantly' 
                : 'وضع المعاينة • اشترِ لتحميل جميع البطاقات فوراً'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}