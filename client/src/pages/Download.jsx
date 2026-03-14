import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../utils/analytics';

export default function Download() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [cardData, setCardData] = useState(null);
  
  const reference = searchParams.get('reference');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // Fetch card data when page loads
  useEffect(() => {
    if (!reference) {
      setError(language === 'en' ? 'No download reference found' : 'لم يتم العثور على مرجع التحميل');
      return;
    }

    // Get card data from localStorage (saved during payment)
    const savedCardData = localStorage.getItem(`card_${reference}`);
    if (savedCardData) {
      setCardData(JSON.parse(savedCardData));
    }

    // Load download history
    const savedDownloads = JSON.parse(localStorage.getItem('downloads') || '[]');
    setDownloads(savedDownloads.filter(d => d.reference === reference));
  }, [reference, language]);

  // Handle manual download with format selection
  const handleDownload = async (format) => {
    setLoading(true);
    setError('');
    
    try {
      trackEvent('Download', 'Started', format);
      
      let downloadUrl;
      let filename;

      switch(format) {
        case 'png':
          // Download as PNG
          downloadUrl = `${API_URL}/temp/${reference}.png`;
          filename = `EidCard_${reference}.png`;
          break;
          
        case 'jpg':
          // Download as JPG (if available)
          downloadUrl = `${API_URL}/temp/${reference}.jpg`;
          filename = `EidCard_${reference}.jpg`;
          break;
          
        case 'pdf':
          // Download as PDF (if available)
          downloadUrl = `${API_URL}/temp/${reference}.pdf`;
          filename = `EidCard_${reference}.pdf`;
          break;
          
        case 'html':
          // Download as HTML
          downloadUrl = `${API_URL}/temp/${reference}.html`;
          filename = `EidCard_${reference}.html`;
          break;
          
        case 'svg':
          // Download as SVG (vector format)
          downloadUrl = `${API_URL}/temp/${reference}.svg`;
          filename = `EidCard_${reference}.svg`;
          break;
          
        default:
          downloadUrl = `${API_URL}/temp/${reference}.html`;
          filename = `EidCard_${reference}.html`;
      }

      // Try to download the file
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`File not found: ${format}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Save to download history
      const newDownload = {
        reference,
        format,
        timestamp: Date.now(),
        filename
      };
      
      const updatedDownloads = [...downloads, newDownload];
      setDownloads(updatedDownloads);
      localStorage.setItem('downloads', JSON.stringify(updatedDownloads));
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
      
      trackEvent('Download', 'Success', format);
      
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'Download failed. The file may have expired.');
      trackEvent('Download', 'Failed', format);
    } finally {
      setLoading(false);
    }
  };

  // Share card via WhatsApp
  const handleShareWhatsApp = () => {
    const downloadUrl = `${API_URL}/temp/${reference}.html`;
    const text = language === 'en' 
      ? `Check out my Eid card! 🎉\n${downloadUrl}`
      : `شاهد بطاقة العيد الخاصة بي! 🎉\n${downloadUrl}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    trackEvent('Share', 'WhatsApp', reference);
  };

  // Share via Email
  const handleShareEmail = () => {
    const downloadUrl = `${API_URL}/temp/${reference}.html`;
    const subject = language === 'en' ? 'My Eid Card' : 'بطاقة العيد الخاصة بي';
    const body = language === 'en' 
      ? `Here's my personalized Eid card: ${downloadUrl}`
      : `هذه بطاقة العيد المخصصة الخاصة بي: ${downloadUrl}`;
    
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    trackEvent('Share', 'Email', reference);
  };

  // Copy download link
  const handleCopyLink = () => {
    const downloadUrl = `${API_URL}/temp/${reference}.html`;
    navigator.clipboard.writeText(downloadUrl);
    alert(language === 'en' ? 'Link copied to clipboard!' : 'تم نسخ الرابط!');
    trackEvent('Share', 'CopyLink', reference);
  };

  // Regenerate card (if expired)
  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/regenerate/${reference}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        alert(language === 'en' ? 'Card regenerated successfully!' : 'تم إعادة إنشاء البطاقة بنجاح!');
        handleDownload('html');
      } else {
        throw new Error('Regeneration failed');
      }
    } catch (err) {
      setError('Failed to regenerate card. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-8xl mb-4"
          >
            🎉
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gold-text">
            {language === 'en' ? 'Your Card is Ready!' : 'بطاقتك جاهزة!'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'en' 
              ? 'Choose a format below to download your personalized Eid card' 
              : 'اختر صيغة أدناه لتحميل بطاقة العيد المخصصة الخاصة بك'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center"
          >
            <p className="text-red-600">{error}</p>
          </motion.div>
        )}

        {downloadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center"
          >
            <p className="text-green-600">
              {language === 'en' ? '✅ Download started!' : '✅ بدأ التحميل!'}
            </p>
          </motion.div>
        )}

        {/* Main Download Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8">
          
          {/* Format Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center gold-text">
              {language === 'en' ? '📥 Select Download Format' : '📥 اختر صيغة التحميل'}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { id: 'png', label: 'PNG', icon: '🖼️', desc: 'High Quality', popular: true },
                { id: 'jpg', label: 'JPG', icon: '📸', desc: 'Smaller File' },
                { id: 'pdf', label: 'PDF', icon: '📄', desc: 'Print Ready' },
                { id: 'svg', label: 'SVG', icon: '✨', desc: 'Vector Scaleable' },
                { id: 'html', label: 'HTML', icon: '🌐', desc: 'Web Format' }
              ].map(format => (
                <motion.button
                  key={format.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedFormat(format.id);
                    handleDownload(format.id);
                  }}
                  disabled={loading}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    selectedFormat === format.id
                      ? 'border-gold bg-gold/10 shadow-lg'
                      : 'border-gray-200 hover:border-gold/50 hover:bg-gold/5'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {format.popular && (
                    <span className="absolute -top-2 -right-2 bg-gold text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="text-3xl mb-2">{format.icon}</div>
                  <div className="font-bold">{format.label}</div>
                  <div className="text-xs text-gray-500">{format.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Download Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload('png')}
              disabled={loading}
              className="py-4 bg-gradient-to-r from-gold to-amber-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? '⏳' : '📥'} 
              {language === 'en' ? 'Quick Download (PNG)' : 'تحميل سريع (PNG)'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload('pdf')}
              disabled={loading}
              className="py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? '⏳' : '📄'} 
              {language === 'en' ? 'Print Version (PDF)' : 'نسخة للطباعة (PDF)'}
            </motion.button>
          </div>

          {/* Download History */}
          {downloads.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-gold">📋</span>
                {language === 'en' ? 'Download History' : 'سجل التحميلات'}
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {downloads.map((dl, idx) => (
                  <div key={idx} className="text-sm text-gray-600 flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <span>📄 {dl.filename}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {new Date(dl.timestamp).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDownload(dl.format)}
                        className="text-gold hover:text-gold-dark"
                      >
                        🔄
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sharing Options */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center gold-text">
            {language === 'en' ? '📤 Share Your Card' : '📤 شارك بطاقتك'}
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <span>📱</span> WhatsApp
            </button>
            
            <button
              onClick={handleShareEmail}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <span>📧</span> Email
            </button>
            
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <span>🔗</span> Copy Link
            </button>
          </div>
        </div>

        {/* Reference & Support */}
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">Reference: {reference}</p>
          <p>
            {language === 'en' 
              ? 'Need help? Contact us at support@eidcards.io'
              : 'تحتاج مساعدة؟ اتصل بنا على support@eidcards.io'}
          </p>
          {error && error.includes('expired') && (
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="mt-4 text-gold hover:underline"
            >
              {language === 'en' ? '↻ Regenerate Card' : '↻ إعادة إنشاء البطاقة'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}