import { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ScreenshotBlocker({ children, isProtected = true }) {
  const { language } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isProtected) return;

    // 🛡️ LAYER 1: Disable right click
    const disableRightClick = (e) => {
      e.preventDefault();
      return false;
    };

    // 🛡️ LAYER 2: Disable keyboard shortcuts
    const disableKeys = (e) => {
      // PrintScreen detection (can't fully block but we can warn)
      if (e.key === 'PrintScreen') {
        alert(language === 'en' 
          ? '📸 Screenshot detected! Please purchase to download high-quality cards.' 
          : '📸 تم اكتشاف لقطة شاشة! يرجى الشراء لتنزيل بطاقات عالية الجودة.');
        
        // Briefly blur the content
        if (containerRef.current) {
          containerRef.current.style.filter = 'blur(10px)';
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.style.filter = 'none';
            }
          }, 1000);
        }
        return false;
      }
      
      // Ctrl+S, Ctrl+Shift+I, Ctrl+U, F12
      if (
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J')
      ) {
        e.preventDefault();
        alert(language === 'en' 
          ? '🚫 Developer tools are disabled to protect our designers\' work.' 
          : '🚫 أدوات المطور معطلة لحماية عمل المصممين لدينا.');
        return false;
      }
    };

    // 🛡️ LAYER 3: Detect DevTools opening
    const detectDevTools = () => {
      const threshold = 160;
      const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
          // DevTools is likely open
          document.body.style.filter = 'blur(20px)';
          document.body.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-red-50 p-8">
              <div class="text-center">
                <div class="text-6xl mb-4">🚫</div>
                <h1 class="text-2xl font-bold text-red-600 mb-2">
                  ${language === 'en' ? 'Developer Tools Detected' : 'تم اكتشاف أدوات المطور'}
                </h1>
                <p class="text-gray-600">
                  ${language === 'en' 
                    ? 'Please close developer tools to continue using our service.' 
                    : 'يرجى إغلاق أدوات المطور لمواصلة استخدام خدمتنا.'}
                </p>
              </div>
            </div>
          `;
        }
      };
      
      // Check periodically
      const interval = setInterval(checkDevTools, 1000);
      return () => clearInterval(interval);
    };

    // 🛡️ LAYER 4: Add CSS protection
    const style = document.createElement('style');
    style.innerHTML = `
      /* Prevent image dragging */
      img, .protected-content, .protected-content * {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      
      /* Prevent selection */
      .protected-content {
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Blur when printing */
      @media print {
        body {
          visibility: hidden;
        }
        body::after {
          content: "${language === 'en' ? '🔒 Content protected. Purchase to download.' : '🔒 المحتوى محمي. قم بالشراء للتنزيل.'}";
          visibility: visible;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
          color: #FFD700;
          text-align: center;
        }
      }
      
      /* Blur when selecting */
      .protected-content::selection {
        background: transparent;
      }
      
      .protected-content::-moz-selection {
        background: transparent;
      }
    `;
    document.head.appendChild(style);

    // 🛡️ LAYER 5: Add subtle watermark overlay
    const watermark = document.createElement('div');
    watermark.className = 'screenshot-watermark';
    watermark.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.15;
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 100px,
        rgba(255, 215, 0, 0.1) 100px,
        rgba(255, 215, 0, 0.1) 200px
      );
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.3);
      transform: rotate(-30deg);
      white-space: nowrap;
      content: "${language === 'en' ? 'PREVIEW MODE' : 'وضع المعاينة'}";
    `;
    watermark.innerHTML = '🔒 PREVIEW MODE 🔒';
    document.body.appendChild(watermark);

    // 🛡️ LAYER 6: Anti-screenshot canvas trick
    const addCanvasTrick = () => {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
        opacity: 0.02;
      `;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Draw tiny Islamic patterns that will appear in screenshots
      ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
      for (let i = 0; i < canvas.width; i += 50) {
        for (let j = 0; j < canvas.height; j += 50) {
          ctx.beginPath();
          ctx.arc(i, j, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      document.body.appendChild(canvas);
    };

    // Apply all protections
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableKeys);
    
    // More aggressive protection for the container
    if (containerRef.current) {
      containerRef.current.addEventListener('contextmenu', disableRightClick);
      containerRef.current.addEventListener('dragstart', (e) => e.preventDefault());
      containerRef.current.addEventListener('selectstart', (e) => e.preventDefault());
    }

    const cleanupDevTools = detectDevTools();
    addCanvasTrick();

    // Cleanup on unmount
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableKeys);
      cleanupDevTools();
      document.head.removeChild(style);
      if (document.body.contains(watermark)) {
        document.body.removeChild(watermark);
      }
    };
  }, [isProtected, language]);

  return (
    <div 
  ref={containerRef}
  className="protected-content relative"
  onContextMenu={(e) => e.preventDefault()}
  onDragStart={(e) => e.preventDefault()}
  style={{ userSelect: 'none' }} // CSS approach instead
>
      {children}
    </div>
  );
}