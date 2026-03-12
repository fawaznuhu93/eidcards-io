import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function FeedbackForm() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'feedback'
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = language === 'en' ? 'Name is required' : 'الاسم مطلوب';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'en' ? 'Invalid email format' : 'صيغة البريد الإلكتروني غير صحيحة';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = language === 'en' ? 'Message is required' : 'الرسالة مطلوبة';
    } else if (formData.message.trim().length < 5) {
      newErrors.message = language === 'en' 
        ? 'Message must be at least 5 characters' 
        : 'يجب أن تكون الرسالة 5 أحرف على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('submitting');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          page: window.location.pathname
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          type: 'feedback'
        });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrors({ submit: data.errors?.join(', ') || 'Submission failed' });
      }
    } catch (error) {
      console.error('Feedback error:', error);
      setStatus('error');
      setErrors({ submit: 'Network error. Please try again.' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl"
      id="feedback-form"
    >
      <h3 className="text-2xl font-bold mb-6 text-center gold-text">
        {language === 'en' ? '💬 Share Your Feedback' : '💬 شاركنا ملاحظاتك'}
      </h3>

      {status === 'success' ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center py-8"
        >
          <div className="text-6xl mb-4">✨</div>
          <h4 className="text-xl font-bold text-green-600 mb-2">
            {language === 'en' ? 'Thank you!' : 'شكراً لك!'}
          </h4>
          <p className="text-gray-600 mb-4">
            {language === 'en' 
              ? 'Your feedback has been sent. JazakAllah Khair!' 
              : 'تم إرسال ملاحظاتك. جزاك الله خيراً!'}
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-gold hover:underline text-sm"
          >
            {language === 'en' ? 'Send another message' : 'إرسال رسالة أخرى'}
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder={language === 'en' ? 'Your Name *' : 'الاسم *'}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                disabled={status === 'submitting'}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <input
                type="email"
                placeholder={language === 'en' ? 'Email Address *' : 'البريد الإلكتروني *'}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all`}
                disabled={status === 'submitting'}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <input
              type="tel"
              placeholder={language === 'en' ? 'Phone Number (optional)' : 'رقم الهاتف (اختياري)'}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
              disabled={status === 'submitting'}
            />
          </div>

          <div>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
              disabled={status === 'submitting'}
            >
              <option value="feedback">
                {language === 'en' ? '💭 General Feedback' : '💭 ملاحظات عامة'}
              </option>
              <option value="bug">
                {language === 'en' ? '🐛 Report a Bug' : '🐛 الإبلاغ عن مشكلة'}
              </option>
              <option value="feature">
                {language === 'en' ? '💡 Feature Request' : '💡 طلب ميزة'}
              </option>
              <option value="question">
                {language === 'en' ? '❓ Question' : '❓ سؤال'}
              </option>
            </select>
          </div>

          <div>
            <textarea
              placeholder={language === 'en' ? 'Your message... *' : 'رسالتك... *'}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows="5"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.message ? 'border-red-500' : 'border-gray-200'
              } focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none`}
              disabled={status === 'submitting'}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: status === 'submitting' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'submitting' ? 1 : 0.98 }}
            disabled={status === 'submitting'}
            className={`w-full py-4 bg-gradient-to-r from-gold to-amber-500 
                       text-white rounded-xl font-bold text-lg shadow-lg 
                       transition-all duration-300 ${
              status === 'submitting' 
                ? 'opacity-75 cursor-not-allowed' 
                : 'hover:shadow-xl'
            }`}
          >
            {status === 'submitting' 
              ? (language === 'en' ? 'Sending...' : 'جاري الإرسال...')
              : (language === 'en' ? '📨 Send Message' : '📨 إرسال الرسالة')
            }
          </motion.button>
        </form>
      )}
    </motion.div>
  );
}