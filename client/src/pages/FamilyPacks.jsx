import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import FamilyPackCard from '../components/FamilyPackCard';
import { familyPacks } from '../data/familyPacks';

export default function FamilyPacks() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleCustomize = (packId) => {
    navigate(`/family-pack/${packId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gold-text">
          {language === 'en' ? '👨‍👩‍👧 Family Packs' : '👨‍👩‍👧 باقات عائلية'}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {language === 'en'
            ? 'Beautiful matching cards for your entire family - one design, multiple cards'
            : 'بطاقات جميلة متطابقة لجميع أفراد العائلة - تصميم واحد، بطاقات متعددة'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {familyPacks.map((pack, index) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group cursor-pointer"
            onClick={() => handleCustomize(pack.id)}
          >
            <div className="relative">
              <FamilyPackCard pack={pack} />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCustomize(pack.id);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-gold to-amber-500 text-white rounded-lg font-semibold transform scale-90 group-hover:scale-100 transition-transform shadow-xl"
                >
                  {language === 'en' ? '✨ Customize Pack' : '✨ تخصيص الباقة'}
                </button>
              </div>
            </div>
            
            {/* Quick info */}
            <div className="mt-3 text-center">
              <p className="text-sm text-gold/70">
                {pack.features.length} features • 2-5 cards
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}