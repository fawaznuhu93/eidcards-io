import { PaystackButton } from 'paystack-react-lite';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { v4 as uuidv4 } from 'uuid'; // ✅ Import UUID
import { useState } from 'react';
import { trackPurchase, trackEvent } from '../utils/analytics';

// In onSuccess callback:
onSuccess: (response) => {
  trackPurchase(response.reference, product.price);
  trackEvent('Payment', 'Success', product.name, product.price);
  // ... rest of your code
}
export default function PaymentButton({ product, formData, type, onBeforePayment }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const handlePaymentClick = () => {
    if (onBeforePayment) {
      return onBeforePayment();
    }
    return true;
  };

  // Ensure email exists
  if (!formData.email) {
    console.error('Email is required for payment');
    return null;
  }

  // ✅ Use UUID for secure reference
  const config = {
    reference: `EID_${uuidv4()}`, // ✅ More secure than Math.random
    email: formData.email,
    amount: Math.round(product.price * 100),
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: 'USD',
    metadata: {
      product_id: product.id,
      product_name: product.name,
      product_type: type,
      price: product.price,
      currency: 'USD',
      sender_name: formData.senderName,
      recipient_name: formData.recipientName,
      message: formData.message,
      quantity: formData.quantity || 1,
      ...(type === 'family' && { family_cards: formData.cards })
    },
    text: loading 
      ? (language === 'en' ? 'Processing...' : 'جاري المعالجة...')
      : (language === 'en' ? `Pay $${product.price} Now` : `ادفع $${product.price} الآن`),
    onSuccess: (response) => {
      setLoading(false);
      ReactGA.event({
        category: 'Payment',
        action: 'Success',
        value: product.price,
        label: product.name
      });

      navigate(`/verify?reference=${response.reference}&product=${product.id}&type=${type}`);
    },
    onClose: () => {
      setLoading(false);
      ReactGA.event({
        category: 'Payment',
        action: 'Closed Modal'
      });
    }
  };

  return (
    <motion.div
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
    >
      <PaystackButton
        {...config}
        onClick={() => {
          setLoading(true);
          handlePaymentClick();
        }}
        className={`w-full py-4 bg-gradient-to-r from-gold to-amber-500 text-white rounded-xl font-bold text-lg shadow-lg transition-all ${
          loading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl'
        }`}
        disabled={loading}
      />
      <p className="text-center text-sm text-gray-500 mt-2">
        🔒 Secure payment • Receipt sent to {formData.email}
      </p>
    </motion.div>
  );
}