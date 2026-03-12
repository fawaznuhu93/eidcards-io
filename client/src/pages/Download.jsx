import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function Download() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrls, setDownloadUrls] = useState([]);
  
  const reference = searchParams.get('reference');

  // Fetch available downloads when page loads
  useEffect(() => {
    if (!reference) {
      setError(language === 'en' ? 'No download reference found' : 'لم يتم العثور على مرجع التحميل');
      return;
    }

    // Check localStorage for previously downloaded files
    const savedDownloads = JSON.parse(localStorage.getItem('downloads') || '[]');
    setDownloads(savedDownloads);
    
    // In a real implementation, you might fetch the file list from backend
    // For now, we'll simulate with the reference
    setDownloadUrls([`${reference}.png`]);
  }, [reference, language]);

  const handleDownload = async (format) => {
    setLoading(true);
    setError('');
    
    try {
      // ✅ CORRECT API CALL using environment variable
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      // For HTML format (our current backend generates HTML)
      if (format === 'HTML') {
        // Open the HTML file in a new tab
        window.open(`${API_URL}/temp/${reference}.html`, '_blank');
        
        // Save to localStorage for history
        const newDownload = {
          reference,
          format: 'HTML',
          timestamp: Date.now(),
          url: `${API_URL}/temp/${reference}.html`
        };
        
        const updatedDownloads = [...downloads, newDownload];
        setDownloads(updatedDownloads);
        localStorage.setItem('downloads', JSON.stringify(updatedDownloads));
        
        setLoading(false);
        return;
      }
      
      // For image formats, we'd need a conversion endpoint
      // This is a placeholder - in production you'd have a real endpoint
      alert(`In production, this would download as ${format}. For now, please use HTML format.`);
      
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'Download failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const link = `${API_URL}/temp/${reference}.html`;
    navigator.clipboard.writeText(link);
    alert(language === 'en' ? 'Link copied to clipboard!' : 'تم نسخ الرابط!');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gold-text">
          {language === 'en' ? 'Download Your Cards' : 'تحميل بطاقاتك'}
        </h1>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          {error ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-dark transition-colors"
              >
                {language === 'en' ? 'Browse Cards' : 'تصفح البطاقات'}
              </button>
            </div>
          ) : (
            <>
              <p className="text-green-600 mb-6">
                ✅ {language === 'en' 
                  ? 'Your payment was successful!' 
                  : 'تم الدفع بنجاح!'}
              </p>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">
                  {language === 'en' ? 'Your card is ready!' : 'بطاقتك جاهزة!'}
                </h3>
                
                {/* Download buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => handleDownload('HTML')}
                    disabled={loading}
                    className={`px-6 py-3 bg-gold text-white rounded-xl font-semibold 
                      ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gold-dark'} 
                      transition-colors flex items-center gap-2`}
                  >
                    {loading ? '⏳' : '📥'} 
                    {language === 'en' ? 'Download HTML Card' : 'تحميل بطاقة HTML'}
                  </button>
                  
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    📋 {language === 'en' ? 'Copy Link' : 'نسخ الرابط'}
                  </button>
                </div>
                
                {/* Format options note */}
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 mb-2">
                    ⚡ {language === 'en' 
                      ? 'For PNG/JPG/PDF formats, please contact support' 
                      : 'للحصول على صيغ PNG/JPG/PDF، يرجى الاتصال بالدعم'}
                  </p>
                </div>
                
                {/* Download history */}
                {downloads.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold mb-3">
                      {language === 'en' ? 'Previous Downloads' : 'التحميلات السابقة'}
                    </h4>
                    <div className="space-y-2">
                      {downloads.slice(-3).map((dl, idx) => (
                        <div key={idx} className="text-sm text-gray-600 flex justify-between items-center">
                          <span>📄 {dl.reference}.{dl.format}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(dl.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-4">
                  Reference: {reference}
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}