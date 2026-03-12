import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function PaymentButton({ product, formData, type, onBeforePayment }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log('Paystack script loaded');
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Validate email exists
  const customerEmail = formData?.email || formData?.cards?.[0]?.email;
  
  if (!customerEmail) {
    console.error('Email is required for payment');
    return (
      <div className="text-center p-4 bg-red-50 rounded-xl">
        <p className="text-red-600 text-sm">
          {language === 'en' 
            ? 'Please enter your email address' 
            : 'الرجاء إدخال بريدك الإلكتروني'}
        </p>
      </div>
    );
  }

  const handlePaymentClick = () => {
    setError('');
    
    if (onBeforePayment) {
      const canProceed = onBeforePayment();
      if (canProceed === false) {
        return false;
      }
    }
    
    setLoading(true);
    
    // Check if Paystack is loaded
    if (!window.PaystackPop) {
      setError('Payment system loading. Please try again.');
      setLoading(false);
      return;
    }

    try {
      // Prepare metadata
      const metadata = {
        product_id: product.id,
        product_name: product.name,
        product_type: type,
        price_usd: product.price, // Store USD price in metadata
        currency: 'NGN',
        timestamp: Date.now(),
        custom_fields: []
      };

      // Add sender info
      if (formData.senderName) {
        metadata.custom_fields.push({
          display_name: "Sender Name",
          variable_name: "sender_name",
          value: formData.senderName
        });
      }

      if (formData.recipientName) {
        metadata.custom_fields.push({
          display_name: "Recipient Name",
          variable_name: "recipient_name",
          value: formData.recipientName
        });
      }

      if (formData.message) {
        metadata.custom_fields.push({
          display_name: "Message",
          variable_name: "message",
          value: formData.message
        });
      }

      // For family packs
      if (type === 'family' && formData.cards) {
        metadata.quantity = formData.quantity;
        metadata.family_cards = JSON.stringify(formData.cards);
      }

      const reference = `EID_${uuidv4()}`;

      // 🔴 CRITICAL: Convert USD to NGN (using exchange rate)
      // $1 USD = ₦1,500 NGN (adjust this rate based on current market)
      const USD_TO_NGN_RATE = 1500; 
      
      // Calculate NGN amount
      // Paystack expects amount in kobo (1 NGN = 100 kobo)
      const ngnAmount = Math.round(product.price * USD_TO_NGN_RATE * 100);
      
      console.log(`💰 Converting $${product.price} USD to ₦${product.price * USD_TO_NGN_RATE} NGN (${ngnAmount} kobo)`);

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: customerEmail,
        amount: ngnAmount, // Amount in kobo
        currency: 'NGN',
        ref: reference,
        metadata: metadata,
        callback: function(response) {
          // Payment successful
          setLoading(false);
          console.log('Payment successful:', response);
          navigate(`/verify?reference=${response.reference}&product=${product.id}&type=${type}`);
        },
        onClose: function() {
          // Payment window closed
          setLoading(false);
          console.log('Payment modal closed');
        }
      });

      handler.openIframe();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Payment failed');
      console.error('Payment error:', err);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}
      
      <motion.div
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        <button
          onClick={handlePaymentClick}
          disabled={loading}
          className={`w-full py-4 bg-gradient-to-r from-gold to-amber-500 
                     text-white rounded-xl font-bold text-lg shadow-lg 
                     transition-all duration-300 ${
            loading 
              ? 'opacity-75 cursor-not-allowed' 
              : 'hover:shadow-xl hover:from-gold-dark hover:to-amber-600'
          }`}
        >
          {loading 
            ? (language === 'en' ? 'Processing...' : 'جاري المعالجة...')
            : (language === 'en' ? `Pay $${product.price} Now` : `ادفع $${product.price} الآن`)}
        </button>
      </motion.div>
      
      <p className="text-center text-xs sm:text-sm text-gray-500">
        🔒 Secure payment • You'll be charged in NGN at checkout
      </p>
      
      {/* Show approximate NGN amount for transparency */}
      <p className="text-center text-xs text-amber-600">
        ≈ ₦{(product.price * 1500).toLocaleString()} NGN
      </p>
      
      {/* Test mode notice */}
      {import.meta.env.DEV && (
        <p className="text-center text-xs text-amber-600">
          🧪 Test Mode: Use card 4084 0840 8408 4081
        </p>
      )}
    </div>
  );
}