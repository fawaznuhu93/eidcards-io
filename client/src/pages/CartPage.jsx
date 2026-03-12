import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PaymentButton from '../components/PaymentButton';

export default function CartPage() {
  const { language } = useLanguage();
  const { cart, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, checkout, payment

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-4xl font-bold mb-4 gold-text">
            {language === 'en' ? 'Your Cart is Empty' : 'سلة التسوق فارغة'}
          </h1>
          <p className="text-gray-600 mb-8">
            {language === 'en' 
              ? 'Looks like you haven\'t added any cards yet.' 
              : 'يبدو أنك لم تضف أي بطاقات بعد.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/individual"
              className="px-6 py-3 bg-gold text-white rounded-lg font-semibold hover:bg-gold-dark transition-colors"
            >
              {language === 'en' ? 'Browse Cards' : 'تصفح البطاقات'}
            </Link>
            <Link
              to="/video"
              className="px-6 py-3 border-2 border-gold text-gold rounded-lg font-semibold hover:bg-gold/10 transition-colors"
            >
              {language === 'en' ? 'Browse Videos' : 'تصفح الفيديوهات'}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleCheckout = () => {
    setCheckoutStep('checkout');
  };

  const cartItems = Object.values(cart.reduce((acc, item) => {
    const key = `${item.id}-${item.type}`;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 0 };
    }
    acc[key].quantity += item.quantity || 1;
    return acc;
  }, {}));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 gold-text">
        {language === 'en' ? '🛒 Shopping Cart' : '🛒 سلة التسوق'}
      </h1>

      {checkoutStep === 'cart' && (
        <div className="max-w-4xl mx-auto">
          {/* Cart Items */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
            {cartItems.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.type}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-gold/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">
                      {item.type === 'video' ? '🎬' : item.type === 'family' ? '👨‍👩‍👧' : '🌙'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.type === 'video' ? 'Video Card' : 
                       item.type === 'family' ? 'Family Pack' : 'Individual Card'}
                    </p>
                    {item.senderName && (
                      <p className="text-xs text-gray-500">From: {item.senderName}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Quantity selector */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.type, (item.quantity || 1) - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.type, (item.quantity || 1) + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-bold gold-text w-20 text-right">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">
                {language === 'en' ? 'Total Items:' : 'إجمالي العناصر:'}
              </span>
              <span className="text-lg">{cartCount}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold">
                {language === 'en' ? 'Total:' : 'المجموع:'}
              </span>
              <span className="text-3xl font-bold gold-text">${cartTotal.toFixed(2)}</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="flex-1 py-3 border-2 border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors"
              >
                {language === 'en' ? 'Clear Cart' : 'تفريغ السلة'}
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-dark transition-colors"
              >
                {language === 'en' ? 'Proceed to Checkout' : 'المتابعة للدفع'}
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutStep === 'checkout' && (
        <CheckoutForm 
          cartItems={cartItems}
          cartTotal={cartTotal}
          onBack={() => setCheckoutStep('cart')}
          onPayment={() => setCheckoutStep('payment')}
        />
      )}

      {checkoutStep === 'payment' && (
        <PaymentForm
          cartItems={cartItems}
          cartTotal={cartTotal}
          onBack={() => setCheckoutStep('checkout')}
        />
      )}
    </div>
  );
}

// Checkout Form Component
function CheckoutForm({ cartItems, cartTotal, onBack, onPayment }) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      alert(language === 'en' ? 'Please fill in all fields' : 'الرجاء ملء جميع الحقول');
      return;
    }
    onPayment();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold mb-6 gold-text">
        {language === 'en' ? '📝 Checkout Details' : '📝 تفاصيل الدفع'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-amber-50 rounded-xl p-4 my-4">
          <h3 className="font-semibold mb-2">
            {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
          </h3>
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-bold">
            <span>{language === 'en' ? 'Total' : 'المجموع'}</span>
            <span className="gold-text">${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 border-2 border-gold text-gold rounded-xl font-semibold hover:bg-gold/10"
          >
            {language === 'en' ? 'Back' : 'رجوع'}
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-dark"
          >
            {language === 'en' ? 'Continue to Payment' : 'المتابعة للدفع'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// Payment Form Component
function PaymentForm({ cartItems, cartTotal, onBack }) {
  const { language } = useLanguage();

  // Create a combined product for payment
  const combinedProduct = {
    id: 'cart-checkout',
    name: language === 'en' ? 'Cart Items' : 'عناصر السلة',
    price: cartTotal
  };

  // Prepare form data for payment
  const formData = {
    email: 'customer@example.com', // This would come from checkout form
    items: cartItems,
    type: 'cart'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold mb-6 gold-text">
        {language === 'en' ? '💳 Payment' : '💳 الدفع'}
      </h2>

      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <p className="text-blue-700 text-center">
          {language === 'en'
            ? `Total amount: $${cartTotal.toFixed(2)}`
            : `المبلغ الإجمالي: $${cartTotal.toFixed(2)}`}
        </p>
      </div>

      <PaymentButton
        product={combinedProduct}
        formData={formData}
        type="cart"
      />

      <button
        onClick={onBack}
        className="w-full text-sm text-gold hover:underline mt-4"
      >
        ← {language === 'en' ? 'Go Back' : 'العودة'}
      </button>
    </motion.div>
  );
}