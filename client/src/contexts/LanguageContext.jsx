import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      individual: 'Individual Cards',
      video: 'Video Cards',
      family: 'Family Packs',
      cart: 'Cart',
      browse: 'Browse Cards',
      watch: 'Watch Videos'
    },
    
    // Hero Section
    hero: {
      title: '✨ Send a truly personal Eid greeting! ✨',
      subtitle: 'Add your name and a special message, and your card will be instantly ready to download and share. Make your wishes stand out this Eid with a beautiful, custom-designed card.',
      cta: 'Browse Cards',
      watch: 'Watch Videos',
      preview: 'PREVIEW - Your name & message here!'
    },
    
    // Sample Card
    sampleCard: {
      from: 'From:',
      message: 'Eid Mubarak everyone! May your Eid be blessed and joyous 🌙'
    },
    
    // Features
    features: {
      personalized: {
        title: 'Personalized',
        desc: 'Your name and message beautifully displayed on your Eid card!'
      },
      instant: {
        title: 'Instant Download',
        desc: 'No waiting — get your card instantly after payment!'
      },
      unique: {
        title: 'Unique Designs',
        desc: 'Stand out with world-class, exclusive Eid cards'
      }
    },
    
    // Cards
    cards: {
      customize: 'Customize',
      preview: 'Preview',
      buy: 'Purchase',
      from: 'From:',
      yourName: 'Your Name',
      recipientName: 'Recipient Name',
      yourMessage: 'Your Message',
      yourEmail: 'Your Email',
      total: 'Total:',
      secure: '🔒 Secure payment • Instant download'
    },
    
    // Family Pack
    family: {
      title: '👨‍👩‍👧 Family Pack',
      howMany: 'How many cards? (2-5)',
      card: 'Card',
      total: 'Total:'
    },
    
    // Payment
    payment: {
      pay: 'Pay $',
      now: 'Now',
      processing: 'Processing...',
      verify: 'Verifying Payment',
      success: 'Payment Successful!',
      failed: 'Verification Failed'
    },
    
    // Feedback
    feedback: {
      title: '💬 We value your feedback',
      name: 'Your Name',
      email: 'Email Address',
      phone: 'Phone Number',
      message: 'Your message...',
      send: 'Send Message',
      thankYou: 'Thank you!',
      thankYouMsg: 'Your message has been sent. JazakAllah Khair!'
    }
  },
  
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      individual: 'بطاقات فردية',
      video: 'بطاقات فيديو',
      family: 'باقات عائلية',
      cart: 'السلة',
      browse: 'تصفح البطاقات',
      watch: 'شاهد الفيديوهات'
    },
    
    // Hero Section
    hero: {
      title: '✨ أرسل تهنئة عيد شخصية حقاً! ✨',
      subtitle: 'أضف اسمك ورسالة خاصة، وستكون بطاقتك جاهزة للتنزيل والمشاركة فوراً. اجعل تمنياتك مميزة هذا العيد ببطاقة جميلة ومصممة خصيصاً.',
      cta: 'تصفح البطاقات',
      watch: 'شاهد الفيديوهات',
      preview: 'معاينة - اسمك ورسالتك هنا!'
    },
    
    // Sample Card
    sampleCard: {
      from: 'من:',
      message: 'كل عام وأنتم بخير! عيد مبارك 🌙'
    },
    
    // Features
    features: {
      personalized: {
        title: 'شخصي',
        desc: 'اسمك ورسالتك معروضة بشكل جميل على بطاقة العيد!'
      },
      instant: {
        title: 'تحميل فوري',
        desc: 'لا انتظار — احصل على بطاقتك فوراً بعد الدفع!'
      },
      unique: {
        title: 'تصاميم فريدة',
        desc: 'تميز ببطاقات عيد عالمية المستوى وحصرية'
      }
    },
    
    // Cards
    cards: {
      customize: 'تخصيص',
      preview: 'معاينة',
      buy: 'شراء',
      from: 'من:',
      yourName: 'اسمك',
      recipientName: 'اسم المستلم',
      yourMessage: 'رسالتك',
      yourEmail: 'بريدك الإلكتروني',
      total: 'المجموع:',
      secure: '🔒 دفع آمن • تحميل فوري'
    },
    
    // Family Pack
    family: {
      title: '👨‍👩‍👧 باقة عائلية',
      howMany: 'كم بطاقة؟ (٥-٢)',
      card: 'بطاقة',
      total: 'المجموع:'
    },
    
    // Payment
    payment: {
      pay: 'ادفع $',
      now: 'الآن',
      processing: 'جاري المعالجة...',
      verify: 'جاري التحقق من الدفع',
      success: 'تم الدفع بنجاح!',
      failed: 'فشل التحقق'
    },
    
    // Feedback
    feedback: {
      title: '💬 نقدر ملاحظاتك',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      message: 'رسالتك...',
      send: 'إرسال الرسالة',
      thankYou: 'شكراً لك!',
      thankYouMsg: 'تم إرسال رسالتك. جزاك الله خيراً!'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [dir, setDir] = useState('ltr');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    setDir(newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    
    // Store preference
    localStorage.setItem('preferred_language', newLang);
  };

  // Load saved preference
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguage(savedLang);
      setDir(savedLang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      dir, 
      toggleLanguage, 
      t: translations[language] 
    }}>
      <div dir={dir} className={language === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};