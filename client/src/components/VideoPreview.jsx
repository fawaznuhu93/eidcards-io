import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function VideoPreview({ type, colorScheme, isPlaying, onPlay, userName, message }) {
  const { language } = useLanguage();
  const canvasRef = useRef(null);
  const [frame, setFrame] = useState(0);
  const animationRef = useRef(null);

  // Canvas animation based on video type
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = 500;
    let height = canvas.height = 500;

    const animate = () => {
      setFrame(prev => (prev + 1) % 360);
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw background based on video type
      switch(type) {
        case 'gold-particles':
          drawGoldParticles(ctx, width, height, frame);
          break;
        case 'gold-crescent':
          drawGoldCrescent(ctx, width, height, frame);
          break;
        case 'emerald-flow':
          drawEmeraldFlow(ctx, width, height, frame);
          break;
        case 'emerald-sparkle':
          drawEmeraldSparkle(ctx, width, height, frame);
          break;
        case 'sapphire-stars':
          drawSapphireStars(ctx, width, height, frame);
          break;
        case 'sapphire-waves':
          drawSapphireWaves(ctx, width, height, frame);
          break;
        case 'ruby-ribbons':
          drawRubyRibbons(ctx, width, height, frame);
          break;
        case 'ruby-heart':
          drawRubyHeart(ctx, width, height, frame);
          break;
        case 'purple-royal':
          drawPurpleRoyal(ctx, width, height, frame);
          break;
        case 'purple-mystic':
          drawPurpleMystic(ctx, width, height, frame);
          break;
        case 'pink-blossom':
          drawPinkBlossom(ctx, width, height, frame);
          break;
        case 'pink-rose':
          drawPinkRose(ctx, width, height, frame);
          break;
        case 'orange-sunset':
          drawOrangeSunset(ctx, width, height, frame);
          break;
        case 'orange-fire':
          drawOrangeFire(ctx, width, height, frame);
          break;
        case 'silver-geo':
          drawSilverGeo(ctx, width, height, frame);
          break;
        case 'silver-sparkle':
          drawSilverSparkle(ctx, width, height, frame);
          break;
        case 'eid-special':
          drawEidSpecial(ctx, width, height, frame);
          break;
        default:
          drawDefault(ctx, width, height, frame);
      }

      // Draw mosque based on video type
      drawMosqueByType(ctx, width, height, frame, type);

      // Draw Kaaba for special videos
      if (type.includes('special') || type.includes('gold') || type.includes('emerald')) {
        drawKaaba(ctx, width, height, frame);
      }

      // Draw floating Eid Mubarak text
      drawFloatingEidText(ctx, width, height, frame, language);

      // Draw user name if provided
      if (userName) {
        drawUserName(ctx, width, height, userName);
      }

      // Draw message if provided
      if (message) {
        drawMessage(ctx, width, height, message);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, type, frame, userName, message, language]);

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover"
      />
      
      {/* Play button overlay */}
      {!isPlaying && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm group"
        >
          <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center shadow-2xl group-hover:bg-amber-500 transition-colors">
            <span className="text-4xl text-white ml-1">▶</span>
          </div>
        </motion.button>
      )}

      {/* Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
        <p className="text-white text-2xl font-bold transform rotate-30 uppercase tracking-wider">
          🔒 PREVIEW
        </p>
      </div>

      {/* Duration badge */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
        {type === 'eid-special' ? '25 sec' : '15-20 sec'}
      </div>
    </div>
  );
}

// ===== DRAW MOSQUE BY TYPE =====
function drawMosqueByType(ctx, w, h, frame, type) {
  switch(type) {
    case 'gold-particles':
    case 'gold-crescent':
      drawOttomanMosque(ctx, w, h, frame, '#FFD700');
      break;
    case 'emerald-flow':
    case 'emerald-sparkle':
      drawAndalusianMosque(ctx, w, h, frame, '#10B981');
      break;
    case 'sapphire-stars':
    case 'sapphire-waves':
      drawPersianMosque(ctx, w, h, frame, '#3B82F6');
      break;
    case 'ruby-ribbons':
    case 'ruby-heart':
      drawMughalMosque(ctx, w, h, frame, '#EF4444');
      break;
    case 'purple-royal':
    case 'purple-mystic':
      drawSeljukMosque(ctx, w, h, frame, '#8B5CF6');
      break;
    case 'pink-blossom':
    case 'pink-rose':
      drawMoroccanMosque(ctx, w, h, frame, '#EC4899');
      break;
    case 'orange-sunset':
    case 'orange-fire':
      drawArabianMosque(ctx, w, h, frame, '#F97316');
      break;
    case 'silver-geo':
    case 'silver-sparkle':
      drawModernMosque(ctx, w, h, frame, '#9CA3AF');
      break;
    case 'eid-special':
      drawStarlitMosque(ctx, w, h, frame, '#8B5CF6');
      break;
    default:
      drawOttomanMosque(ctx, w, h, frame, '#FFD700');
  }
}

// ===== MOSQUE STYLES =====

function drawOttomanMosque(ctx, w, h, frame, color) {
  ctx.save();
  ctx.translate(w/2, h * 0.7);
  
  // Main dome
  ctx.beginPath();
  ctx.arc(0, -30, 40, 0, Math.PI, true);
  ctx.fillStyle = `${color}80`;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20 + Math.sin(frame * 0.05) * 10;
  ctx.fill();
  
  // Side domes
  ctx.beginPath();
  ctx.arc(-35, -10, 20, 0, Math.PI, true);
  ctx.fillStyle = `${color}60`;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(35, -10, 20, 0, Math.PI, true);
  ctx.fillStyle = `${color}60`;
  ctx.fill();
  
  // Minarets
  ctx.fillStyle = `${color}90`;
  ctx.shadowBlur = 15;
  ctx.fillRect(-55, -80, 8, 100);
  ctx.fillRect(47, -80, 8, 100);
  
  // Crescent
  ctx.beginPath();
  ctx.arc(0, -70, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.shadowBlur = 30;
  ctx.fill();
  
  ctx.restore();
}

function drawAndalusianMosque(ctx, w, h, frame, color) {
  ctx.save();
  ctx.translate(w/2, h * 0.7);
  
  // Horseshoe arches
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(i * 30, -20, 15, 0, Math.PI, true);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  
  // Square minaret
  ctx.fillStyle = `${color}80`;
  ctx.fillRect(50, -70, 15, 90);
  
  ctx.restore();
}

function drawPersianMosque(ctx, w, h, frame, color) {
  ctx.save();
  ctx.translate(w/2, h * 0.7);
  
  // Blue dome
  ctx.beginPath();
  ctx.arc(0, -40, 45, 0, Math.PI, true);
  ctx.fillStyle = `${color}80`;
  ctx.shadowBlur = 20;
  ctx.fill();
  
  // Iwan arch
  ctx.beginPath();
  ctx.rect(-30, -20, 60, 40);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();
  
  // Twin minarets
  ctx.fillStyle = `${color}90`;
  ctx.fillRect(-50, -80, 8, 100);
  ctx.fillRect(42, -80, 8, 100);
  
  ctx.restore();
}

function drawMughalMosque(ctx, w, h, frame, color) {
  ctx.save();
  ctx.translate(w/2, h * 0.7);
  
  // Onion domes
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.arc(i * 30, -40, 20, 0, Math.PI, true);
    ctx.fillStyle = `${color}80`;
    ctx.fill();
  }
  
  // Red sandstone base
  ctx.fillStyle = '#B91C1C';
  ctx.fillRect(-50, -10, 100, 10);
  
  ctx.restore();
}

function drawSeljukMosque(ctx, w, h, frame, color) {
  ctx.save();
  ctx.translate(w/2, h * 0.7);
  
  // Geometric dome
  ctx.beginPath();
  ctx.arc(0, -30, 35, 0, Math.PI * 2);
  ctx.fillStyle = `${color}80`;
  ctx.fill();
  
  // Star pattern
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45 + frame) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(Math.cos(angle) * 50, Math.sin(angle) * 50 - 30);
    ctx.strokeStyle = `${color}40`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawMoroccanMosque(ctx, w, h, frame, color) {
  ctx.save();
  ctx.translate(w/2, h * 0.7);
  
  // Square minaret
  ctx.fillStyle = `${color}80`;
  ctx.fillRect(-20, -70, 40, 90);
  
  // Geometric pattern
  for (let y = -60; y < -20; y += 15) {
    for (let x = -10; x < 10; x += 10) {
      ctx.beginPath();
      ctx.rect(x, y, 5, 5);
      ctx.fillStyle = `${color}60`;
      ctx.fill();
    }
  }
  
  ctx.restore();
}

function drawArabianMosque(ctx, w, h, frame, color) {
  ctx.save();
  ctx.translate(w/2, h * 0.7);
  
  // Palm tree style minarets
  ctx.fillStyle = `${color}80`;
  ctx.fillRect(-40, -80, 6, 100);
  ctx.fillRect(34, -80, 6, 100);
  
  // Central dome
  ctx.beginPath();
  ctx.arc(0, -30, 30, 0, Math.PI, true);
  ctx.fillStyle = `${color}90`;
  ctx.fill();
  
  ctx.restore();
}

function drawModernMosque(ctx, w, h, frame, color) {
  ctx.save();
  ctx.translate(w/2, h * 0.7);
  
  // Geometric shapes
  ctx.fillStyle = `${color}80`;
  ctx.fillRect(-30, -50, 60, 10);
  ctx.fillRect(-20, -80, 10, 70);
  ctx.fillRect(10, -80, 10, 70);
  
  // Abstract dome
  ctx.beginPath();
  ctx.arc(0, -90, 15, 0, Math.PI * 2);
  ctx.fillStyle = `${color}60`;
  ctx.fill();
  
  ctx.restore();
}

function drawStarlitMosque(ctx, w, h, frame, color) {
  ctx.save();
  ctx.translate(w/2, h * 0.7);
  
  // Mosque silhouette
  ctx.fillStyle = `${color}40`;
  ctx.fillRect(-30, -50, 60, 70);
  ctx.beginPath();
  ctx.arc(0, -80, 25, 0, Math.PI, true);
  ctx.fill();
  
  // Stars
  for (let i = 0; i < 20; i++) {
    const x = -100 + Math.random() * 200;
    const y = -150 + Math.random() * 150;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(frame*0.1 + i)*0.3})`;
    ctx.fill();
  }
  
  ctx.restore();
}

// ===== KAABA DRAWING =====
function drawKaaba(ctx, w, h, frame) {
  ctx.save();
  ctx.translate(w/4, h/3);
  
  // Kaaba base
  ctx.fillStyle = '#2D2D2D';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 20;
  ctx.fillRect(-20, -30, 40, 50);
  
  // Gold door
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(-5, -15, 10, 20);
  
  // Black kiswah
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.strokeRect(-20, -30, 40, 50);
  
  // Gold belt
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(-15, -5, 30, 2);
  
  // Hajar al-Aswad
  ctx.beginPath();
  ctx.arc(15, -20, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  
  ctx.restore();
}

// ===== FLOATING EID TEXT =====
function drawFloatingEidText(ctx, w, h, frame, language) {
  ctx.save();
  
  const text = language === 'en' ? 'EID MUBARAK' : 'عيد مبارك';
  const yOffset = Math.sin(frame * 0.05) * 10;
  
  // Floating effect
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 30 + Math.sin(frame * 0.1) * 10;
  
  // Main text
  ctx.font = 'bold 48px "Arial", "Amiri", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Gold gradient
  const gradient = ctx.createLinearGradient(w/2 - 100, h/4 + yOffset, w/2 + 100, h/4 + yOffset);
  gradient.addColorStop(0, '#FFD700');
  gradient.addColorStop(0.5, '#FFA500');
  gradient.addColorStop(1, '#FFD700');
  
  ctx.fillStyle = gradient;
  ctx.fillText(text, w/2, h/4 + yOffset);
  
  // Outline for better visibility
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeText(text, w/2, h/4 + yOffset);
  
  ctx.restore();
}

// ===== BACKGROUND STYLES =====
function drawGoldParticles(ctx, w, h, frame) {
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, '#4B3B2A');
  gradient.addColorStop(1, '#6B4F3A');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Gold particles
  for (let i = 0; i < 50; i++) {
    const x = (Math.sin(frame * 0.02 + i) * 50 + i * 30) % w;
    const y = (Math.cos(frame * 0.03 + i) * 50 + i * 20) % h;
    const size = 3 + Math.sin(frame * 0.1 + i) * 2;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(frame*0.1 + i)*0.2})`;
    ctx.fill();
  }
}

function drawGoldCrescent(ctx, w, h, frame) {
  // Background
  ctx.fillStyle = '#2A1F15';
  ctx.fillRect(0, 0, w, h);

  // Rotating crescent
  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.rotate(frame * 0.02);
  
  ctx.beginPath();
  ctx.arc(0, 0, 100, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 30;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(-20, -10, 85, 0, Math.PI * 2);
  ctx.fillStyle = '#2A1F15';
  ctx.shadowBlur = 0;
  ctx.fill();
  
  ctx.restore();
}

function drawEmeraldFlow(ctx, w, h, frame) {
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, '#064E3B');
  gradient.addColorStop(1, '#065F46');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 10; i++) {
    const offset = frame * 2 + i * 50;
    
    ctx.beginPath();
    ctx.moveTo(0, offset % h);
    for (let x = 0; x < w; x += 20) {
      const y = (offset + Math.sin(x * 0.02 + frame * 0.1) * 50) % h;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 + Math.sin(frame*0.1)*0.1})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function drawEmeraldSparkle(ctx, w, h, frame) {
  ctx.fillStyle = '#065F46';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 30; i++) {
    const x = (Math.sin(frame * 0.02 + i) * 100 + 200) % w;
    const y = (Math.cos(frame * 0.03 + i) * 100 + 200) % h;
    const size = 5 + Math.sin(frame * 0.1 + i) * 3;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(frame * 0.01);
    
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size, 0);
    ctx.closePath();
    
    ctx.fillStyle = `rgba(16, 185, 129, ${0.5 + Math.sin(frame*0.1 + i)*0.3})`;
    ctx.shadowColor = '#10B981';
    ctx.shadowBlur = 15;
    ctx.fill();
    
    ctx.restore();
  }
}

function drawSapphireStars(ctx, w, h, frame) {
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#0C4A6E');
  gradient.addColorStop(1, '#0F3B5E');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 100; i++) {
    const x = (i * 37 + frame) % w;
    const y = (i * 23 + frame * 2) % h;
    const size = 1 + Math.sin(frame * 0.1 + i) * 1;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(frame*0.1 + i)*0.3})`;
    ctx.fill();
  }

  if (frame % 120 < 30) {
    const progress = (frame % 30) / 30;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function drawSapphireWaves(ctx, w, h, frame) {
  ctx.fillStyle = '#0F3B5E';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 5; i++) {
    const offset = frame * 0.5 + i * 50;
    
    ctx.beginPath();
    ctx.moveTo(0, h/2 + Math.sin(offset * 0.01) * 50);
    for (let x = 0; x < w; x += 10) {
      const y = h/2 + Math.sin(x * 0.02 + offset * 0.05) * 50 + i * 30;
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 + Math.sin(offset)*0.1})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawRubyRibbons(ctx, w, h, frame) {
  ctx.fillStyle = '#991B1B';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, h * (0.3 + i * 0.2));
    
    for (let x = 0; x < w; x += 20) {
      const y = h * (0.3 + i * 0.2) + Math.sin(x * 0.02 + frame * 0.05) * 40;
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = `rgba(248, 113, 113, ${0.6})`;
    ctx.lineWidth = 8;
    ctx.stroke();
    
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.3})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function drawRubyHeart(ctx, w, h, frame) {
  ctx.fillStyle = '#9B1C1C';
  ctx.fillRect(0, 0, w, h);

  const scale = 1 + Math.sin(frame * 0.1) * 0.1;
  
  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.scale(scale, scale);
  
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.bezierCurveTo(-50, -30, -30, -50, 0, -20);
  ctx.bezierCurveTo(30, -50, 50, -30, 0, 30);
  
  ctx.fillStyle = '#EF4444';
  ctx.shadowColor = '#F87171';
  ctx.shadowBlur = 30;
  ctx.fill();
  
  ctx.restore();
}

function drawPurpleRoyal(ctx, w, h, frame) {
  const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
  gradient.addColorStop(0, '#5B21B6');
  gradient.addColorStop(1, '#2E1065');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w/2, h/3);
  
  ctx.beginPath();
  ctx.moveTo(-40, 20);
  ctx.lineTo(-25, -20);
  ctx.lineTo(-10, 10);
  ctx.lineTo(10, 10);
  ctx.lineTo(25, -20);
  ctx.lineTo(40, 20);
  ctx.closePath();
  
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 20;
  ctx.fill();
  
  ctx.restore();
}

function drawPurpleMystic(ctx, w, h, frame) {
  const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
  gradient.addColorStop(0, '#4C1D95');
  gradient.addColorStop(0.5, '#2E1065');
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 360; i += 10) {
    const angle = (i + frame) * Math.PI / 180;
    const radius = 50 + i * 0.5;
    const x = w/2 + Math.cos(angle) * radius;
    const y = h/2 + Math.sin(angle) * radius;
    
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(139, 92, 246, ${0.3 + Math.sin(angle)*0.2})`;
    ctx.fill();
  }
}

function drawPinkBlossom(ctx, w, h, frame) {
  ctx.fillStyle = '#9D174D';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 20; i++) {
    const x = (frame * 0.5 + i * 40) % w;
    const y = (Math.sin(frame * 0.05 + i) * 50 + i * 30) % h;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(frame * 0.02);
    
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(236, 72, 153, ${0.4 + Math.sin(frame*0.1 + i)*0.2})`;
    ctx.fill();
    
    ctx.restore();
  }
}

function drawPinkRose(ctx, w, h, frame) {
  ctx.fillStyle = '#831843';
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w/2, h/2);
  
  for (let i = 0; i < 5; i++) {
    const scale = 0.8 + Math.sin(frame * 0.1 + i) * 0.1;
    ctx.save();
    ctx.rotate(i * Math.PI / 2.5);
    ctx.scale(scale, scale);
    
    ctx.beginPath();
    ctx.ellipse(0, -20, 15, 25, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(244, 114, 182, ${0.3 + Math.sin(frame*0.1)*0.2})`;
    ctx.fill();
    
    ctx.restore();
  }
  
  ctx.restore();
}

function drawOrangeSunset(ctx, w, h, frame) {
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#F97316');
  gradient.addColorStop(0.5, '#B45309');
  gradient.addColorStop(1, '#78350F');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w/2, h * 0.7);
  
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.fillStyle = '#FDBA74';
  ctx.shadowColor = '#F97316';
  ctx.shadowBlur = 50;
  ctx.fill();
  
  ctx.restore();
}

function drawOrangeFire(ctx, w, h, frame) {
  ctx.fillStyle = '#7C2D12';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 5; i++) {
    const x = w/2 + Math.sin(frame * 0.1 + i) * 40;
    const y = h * 0.7 + Math.cos(frame * 0.15 + i) * 20;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 30, y + 50);
    ctx.lineTo(x + 30, y + 50);
    ctx.closePath();
    
    ctx.fillStyle = `rgba(249, 115, 22, ${0.3 + Math.sin(frame*0.2)*0.2})`;
    ctx.shadowColor = '#F97316';
    ctx.shadowBlur = 30;
    ctx.fill();
  }
}

function drawSilverGeo(ctx, w, h, frame) {
  ctx.fillStyle = '#1F2937';
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.rotate(frame * 0.01);
  
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate(i * Math.PI / 4);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 50);
    ctx.lineTo(100, -50);
    ctx.closePath();
    
    ctx.strokeStyle = `rgba(156, 163, 175, ${0.3})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  }
  
  ctx.restore();
}

function drawSilverSparkle(ctx, w, h, frame) {
  ctx.fillStyle = '#374151';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 30; i++) {
    const x = (Math.sin(frame * 0.02 + i) * 150 + 200) % w;
    const y = (Math.cos(frame * 0.03 + i) * 150 + 200) % h;
    const size = 3 + Math.sin(frame * 0.1 + i) * 2;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(frame * 0.01);
    
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size, 0);
    ctx.closePath();
    
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(frame*0.1 + i)*0.2})`;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 10;
    ctx.fill();
    
    ctx.restore();
  }
}

function drawEidSpecial(ctx, w, h, frame) {
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, '#4C1D95');
  gradient.addColorStop(0.5, '#9D174D');
  gradient.addColorStop(1, '#B45309');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  
  drawGoldParticles(ctx, w, h, frame);
  drawSapphireStars(ctx, w, h, frame);
  drawPurpleMystic(ctx, w, h, frame);
}

function drawDefault(ctx, w, h, frame) {
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, '#4F46E5');
  gradient.addColorStop(1, '#7C3AED');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function drawUserName(ctx, w, h, name) {
  ctx.save();
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  
  const gradient = ctx.createLinearGradient(w - 180, 20, w - 20, 20);
  gradient.addColorStop(0, '#FFD700');
  gradient.addColorStop(1, '#FFA500');
  ctx.fillStyle = gradient;
  
  ctx.fillText(`From: ${name}`, w - 30, 30);
  ctx.restore();
}

function drawMessage(ctx, w, h, message) {
  ctx.save();
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 0;
  ctx.fillRect(20, h - 80, w - 40, 40);
  
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(message, w/2, h - 50);
  
  ctx.restore();
}