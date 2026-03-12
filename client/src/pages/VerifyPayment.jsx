import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function VerifyPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [errorDetails, setErrorDetails] = useState('');
  
  // Prevent duplicate verification calls
  const [verifiedOnce, setVerifiedOnce] = useState(false);
  const verificationInProgress = useRef(false);

  const reference = searchParams.get('reference');
  const productId = searchParams.get('product');
  const type = searchParams.get('type');

  useEffect(() => {
    const verifyPayment = async () => {
      // Prevent multiple verification calls
      if (verifiedOnce || verificationInProgress.current) {
        console.log('⏭️ Verification already in progress or completed');
        return;
      }

      if (!reference) {
        setStatus('failed');
        setErrorDetails('No reference provided');
        return;
      }

      verificationInProgress.current = true;

      try {
        console.log('🔍 Verifying payment:', reference);
        
        // ✅ CORRECT API CALL using environment variable
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await fetch(`${API_URL}/api/verify/${reference}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Verification response:', data);

        if (data.verified) {
          setStatus('success');
          setPaymentData(data.transaction);
          setVerifiedOnce(true);

          // AUTO-REDIRECT to download page after 3 seconds
          setTimeout(() => {
            navigate(`/download?reference=${reference}`);
          }, 3000);
        } else {
          setStatus('failed');
          setErrorDetails(data.message || 'Verification failed');
        }
      } catch (error) {
        console.error('❌ Verification error:', error);
        setStatus('failed');
        setErrorDetails(error.message || 'Network error - please check your connection');
      } finally {
        verificationInProgress.current = false;
      }
    };

    verifyPayment();
  }, [reference, verifiedOnce, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-3xl p-8 md:p-12 max-w-md w-full text-center"
      >
        {status === 'verifying' && (
          <>
            <div className="text-7xl mb-6 animate-spin">⏳</div>
            <h2 className="text-3xl font-bold mb-4 gold-text">
              {language === 'en' ? 'Verifying Payment' : 'جاري التحقق من الدفع'}
            </h2>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Please wait while we confirm your payment with Paystack...'
                : 'الرجاء الانتظار بينما نؤكد دفعتك مع بايستاك...'
              }
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gold h-2 rounded-full"
              />
            </div>
            <p className="text-sm text-gray-400 mt-4 break-all">
              Reference: {reference}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-7xl mb-6">✅</div>
            <h2 className="text-3xl font-bold mb-4 text-green-600">
              {language === 'en' ? 'Payment Successful!' : 'تم الدفع بنجاح!'}
            </h2>
            <p className="text-gray-600 mb-2">
              {language === 'en'
                ? 'Your card is being prepared...'
                : 'يتم تجهيز بطاقتك...'
              }
            </p>
            {paymentData?.customer?.email && (
              <p className="text-sm text-gray-500 mb-4">
                {language === 'en'
                  ? `Receipt sent to: ${paymentData.customer.email}`
                  : `تم إرسال الإيصال إلى: ${paymentData.customer.email}`
                }
              </p>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
                className="bg-gold h-2 rounded-full"
              />
            </div>
            <p className="text-sm text-gray-500">
              {language === 'en'
                ? 'Redirecting to download page...'
                : 'جاري التوجيه إلى صفحة التحميل...'
              }
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="text-7xl mb-6">❌</div>
            <h2 className="text-3xl font-bold mb-4 text-red-600">
              {language === 'en' ? 'Verification Failed' : 'فشل التحقق'}
            </h2>
            <p className="text-gray-600 mb-4">
              {errorDetails || (language === 'en'
                ? 'We could not verify your payment. Please contact support.'
                : 'لم نتمكن من التحقق من دفعتك. يرجى الاتصال بالدعم.')}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {language === 'en'
                ? 'Reference:'
                : 'المرجع:'}
            </p>
            <div className="bg-gray-100 p-3 rounded-lg mb-6">
              <code className="text-sm break-all">{reference}</code>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-dark transition-colors"
              >
                {language === 'en' ? 'Home' : 'الرئيسية'}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}