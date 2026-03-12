import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import PaymentButton from '../components/PaymentButton';
import ScreenshotBlocker from '../components/ScreenshotBlocker';
import VideoPreview from '../components/VideoPreview';
import { videoCards } from '../data/videoCards';

export default function VideoCardCustomizePage() {
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
  const [step, setStep] = useState(1); // 1: form, 2: preview, 3: payment
  const [formErrors, setFormErrors] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  // Find the video card by ID
  useEffect(() => {
    console.log('Looking for video card with ID:', cardId);
    const foundCard = videoCards.find(c => c.id === cardId);
    
    if (foundCard) {
      console.log('Video card found:', foundCard.name);
      setCard(foundCard);
    } else {
      console.log('Video card not found, redirecting to /video');
      navigate('/video');
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
      setStep(2);
      setIsPlaying(true); // Auto-play video in preview
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setIsPlaying(false);
  };

  const handleProceedToPayment = () => {
    setStep(3);
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
                  {language === 'en' ? 'Personalize Your Video' : 'خصص الفيديو الخاص بك'}
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
                  {language === 'en' ? '👀 Preview Video' : '👀 معاينة الفيديو'}
                </motion.button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold gold-text mb-6">
                  {language === 'en' ? 'Preview Your Video' : 'معاينة الفيديو الخاص بك'}
                </h2>
                
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-green-700 font-medium">
                    {language === 'en' 
                      ? '✨ Your video is ready! Review it below.' 
                      : '✨ الفيديو الخاص بك جاهز! راجعه أدناه.'}
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
                    ${card.price} • {card.duration} • {card.resolution}
                  </p>
                </div>

                <PaymentButton
                  product={card}
                  formData={formData}
                  type="video"
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

          {/* Right: Video Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            <ScreenshotBlocker>
              <div className="relative">
                <div className="absolute inset-0 bg-gold-gradient rounded-3xl blur-xl opacity-50" />
                <div className="relative bg-white rounded-3xl p-1">
                  <div className="bg-gradient-to-br from-amber-50 to-white rounded-3xl overflow-hidden">
                    {/* Video Preview */}
                    <VideoPreview
                      type={card.previewType}
                      colorScheme={card.colorScheme}
                      isPlaying={isPlaying}
                      onPlay={() => setIsPlaying(true)}
                      userName={step >= 2 ? formData.senderName : ''}
                      message={step >= 2 ? formData.message : ''}
                    />
                    
                    {/* Video Info */}
                    <div className="p-4 bg-white border-t border-gold/10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold gold-text">{card.name}</h3>
                        <span className="text-sm text-gray-600">{card.duration}</span>
                      </div>
                      
                      {/* Personalization preview */}
                      {step >= 2 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-gray-600 bg-amber-50 p-2 rounded-lg"
                        >
                          <p><span className="font-semibold">From:</span> {formData.senderName}</p>
                          {formData.recipientName && (
                            <p><span className="font-semibold">To:</span> {formData.recipientName}</p>
                          )}
                          <p className="italic mt-1">"{formData.message}"</p>
                        </motion.div>
                      )}

                      {/* Watermark for preview */}
                      {step !== 3 && (
                        <p className="text-center text-xs text-amber-600 mt-2">
                          🔒 Preview with watermark • Purchase to download HD video
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScreenshotBlocker>
          </motion.div>
        </div>
      </div>
    </div>
  );
}