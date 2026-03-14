import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SampleCard from '../components/SampleCard';
import PremiumCard from '../components/PremiumCard';
import FeedbackForm from '../components/FeedbackForm';
import { premiumCards } from '../data/premiumCards';
import { useMediaQuery } from 'react-responsive';

export default function Home() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1023 });

  // Get featured cards (first 3)
  const featuredCards = premiumCards.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center mb-8 sm:mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="h1-responsive gold-text mb-3 sm:mb-4">
            EidCards.io
          </h1>
          
          <p className="text-responsive text-gray-700 mb-2 gold-text">
            {language === 'en' 
              ? '✨ Send a truly personal Eid greeting! ✨' 
              : '✨ أرسل تهنئة عيد شخصية حقاً! ✨'}
          </p>
          
          <p className="text-small-responsive text-gray-600 max-w-2xl mx-auto px-4 mb-6 sm:mb-8">
            {language === 'en'
              ? 'Add your name and a special message, and your card will be instantly ready to download and share.'
              : 'أضف اسمك ورسالة خاصة، وستكون بطاقتك جاهزة للتنزيل والمشاركة فوراً.'}
          </p>
        </motion.div>

        {/* Sample Card */}
        <SampleCard />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mt-4 sm:mt-6">
          <button
            onClick={() => navigate('/individual')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 
                     bg-gradient-to-r from-gold to-amber-500 
                     text-white rounded-full font-bold text-sm sm:text-base
                     shadow-lg hover:shadow-xl transition-all 
                     touch-friendly"
          >
            {language === 'en' ? '✨ Browse Cards' : '✨ تصفح البطاقات'}
          </button>
          <button
            onClick={() => navigate('/video')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 
                     bg-white/80 backdrop-blur-sm border-2 border-gold
                     text-gold rounded-full font-bold text-sm sm:text-base
                     hover:bg-gold hover:text-white transition-all 
                     touch-friendly"
          >
            {language === 'en' ? '🎬 Watch Videos' : '🎬 شاهد الفيديوهات'}
          </button>
        </div>
      </section>

      {/* Featured Cards Section */}
      <section className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="h2-responsive gold-text text-center mb-2 sm:mb-3 md:mb-4">
          {language === 'en' ? '✨ Featured Cards' : '✨ بطاقات مميزة'}
        </h2>
        
        <p className="text-small-responsive text-gray-600 text-center mb-6 sm:mb-8 md:mb-12 px-4">
          {language === 'en'
            ? 'Our most popular designs'
            : 'تصاميمنا الأكثر شهرة'}
        </p>

        <div className="card-grid container-padding">
          {featuredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isMobile ? { y: -5 } : {}}
              className="cursor-pointer premium-card"
              onClick={() => navigate(`/card/${card.id}`)}
            >
              <PremiumCard 
                card={card} 
                showName="Fawaz Yusuf" 
                showMessage={true} 
              />
              <div className="mt-3 text-center">
                <h3 className="text-base sm:text-lg font-bold">{card.name}</h3>
                <p className="text-gold font-semibold text-sm sm:text-base">${card.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12 sm:mb-16">
        <div className="responsive-grid container-padding">
          <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">✨</div>
            <h3 className="text-base sm:text-lg font-bold gold-text mb-1 sm:mb-2">
              {language === 'en' ? 'Personalized' : 'شخصي'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {language === 'en'
                ? 'Your name and message on every card'
                : 'اسمك ورسالتك على كل بطاقة'}
            </p>
          </div>

          <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⚡</div>
            <h3 className="text-base sm:text-lg font-bold gold-text mb-1 sm:mb-2">
              {language === 'en' ? 'Instant Download' : 'تحميل فوري'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {language === 'en'
                ? 'Get your card immediately after payment'
                : 'احصل على بطاقتك فوراً بعد الدفع'}
            </p>
          </div>

          <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎨</div>
            <h3 className="text-base sm:text-lg font-bold gold-text mb-1 sm:mb-2">
              {language === 'en' ? 'Unique Designs' : 'تصاميم فريدة'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {language === 'en'
                ? 'Premium exclusive Eid cards'
                : 'بطاقات عيد حصرية فاخرة'}
            </p>
          </div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="max-w-full sm:max-w-lg md:max-w-2xl mx-auto px-4">
        <FeedbackForm />
      </section>
    </div>
  );
}