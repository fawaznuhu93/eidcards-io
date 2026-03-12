const fs = require('fs').promises;
const path = require('path');

// Generate a simple text-based card (no canvas needed)
const generateIndividualCard = async (data) => {
  const { productId, senderName, recipientName, message, reference } = data;
  
  // Create a simple HTML card that we'll save as a file
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #1F2937, #111827);
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .card {
            width: 800px;
            height: 1000px;
            background: linear-gradient(135deg, #2A1F15, #4B3B2A);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            position: relative;
            overflow: hidden;
        }
        .pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(circle at 20px 20px, rgba(255,215,0,0.1) 2px, transparent 2px);
            background-size: 40px 40px;
            opacity: 0.3;
        }
        .mosque {
            position: absolute;
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 200px;
        }
        .dome {
            width: 120px;
            height: 80px;
            background: rgba(255,215,0,0.3);
            border-radius: 60px 60px 0 0;
            margin: 0 auto;
        }
        .minaret-left {
            position: absolute;
            left: 50px;
            top: 30px;
            width: 20px;
            height: 120px;
            background: rgba(255,215,0,0.4);
        }
        .minaret-right {
            position: absolute;
            right: 50px;
            top: 30px;
            width: 20px;
            height: 120px;
            background: rgba(255,215,0,0.4);
        }
        .crescent {
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 40px;
            background: #FFD700;
            border-radius: 50%;
            box-shadow: -8px -8px 0 #2A1F15;
        }
        .eid-text {
            position: absolute;
            top: 350px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 60px;
            font-weight: bold;
            color: #FFD700;
            text-shadow: 0 0 20px rgba(255,215,0,0.5);
            letter-spacing: 5px;
        }
        .from-name {
            position: absolute;
            top: 50px;
            right: 50px;
            text-align: right;
            color: #FFD700;
            font-size: 30px;
            font-weight: bold;
        }
        .from-label {
            font-size: 16px;
            color: rgba(255,215,0,0.6);
            margin-bottom: 5px;
        }
        .message {
            position: absolute;
            bottom: 250px;
            left: 0;
            right: 0;
            text-align: center;
            color: white;
            font-size: 28px;
            padding: 0 50px;
            line-height: 1.5;
        }
        .recipient {
            position: absolute;
            bottom: 200px;
            left: 0;
            right: 0;
            text-align: center;
            color: #FFD700;
            font-size: 24px;
        }
        .decorations {
            position: absolute;
            bottom: 50px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 20px;
        }
        .star {
            width: 15px;
            height: 15px;
            background: #FFD700;
            border-radius: 50%;
        }
        .footer-text {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            color: rgba(255,215,0,0.3);
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="pattern"></div>
        
        <div class="mosque">
            <div class="minaret-left"></div>
            <div class="minaret-right"></div>
            <div class="dome"></div>
            <div class="crescent"></div>
        </div>
        
        <div class="eid-text">EID MUBARAK</div>
        
        <div class="from-name">
            <div class="from-label">From:</div>
            <div>${senderName || 'Your Name'}</div>
        </div>
        
        <div class="message">
            ${message || 'Eid Mubarak! May your day be blessed and joyous'}
        </div>
        
        ${recipientName ? `<div class="recipient">→ ${recipientName}</div>` : ''}
        
        <div class="decorations">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
        </div>
        
        <div class="footer-text">✨ تقبل الله طاعتكم ✨</div>
    </div>
</body>
</html>
  `;

  return Buffer.from(htmlContent);
};

// Generate family pack cards
const generateFamilyPack = async (data) => {
  const { cards, reference } = data;
  const buffers = [];
  
  for (let i = 0; i < cards.length; i++) {
    const cardData = {
      ...cards[i],
      productId: data.productId,
      reference: `${reference}_${i}`
    };
    const buffer = await generateIndividualCard(cardData);
    buffers.push(buffer);
  }
  
  return buffers;
};

// Save card to disk
const saveCard = async (buffer, filename) => {
  const filepath = path.join(__dirname, '../temp', filename);
  // Change extension to .html for now
  const htmlFilepath = filepath.replace('.png', '.html');
  await fs.writeFile(htmlFilepath, buffer);
  return htmlFilepath;
};

// Clean up old files
const cleanupOldFiles = async () => {
  const tempDir = path.join(__dirname, '../temp');
  
  try {
    // Check if directory exists
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
      return;
    }
    
    const files = await fs.readdir(tempDir);
    const now = Date.now();
    const expiryHours = parseInt(process.env.CARD_EXPIRY_HOURS) || 24;
    
    for (const file of files) {
      try {
        const filepath = path.join(tempDir, file);
        const stats = await fs.stat(filepath);
        const age = (now - stats.mtimeMs) / (1000 * 60 * 60);
        
        if (age > expiryHours) {
          await fs.unlink(filepath);
          console.log(`Deleted old file: ${file}`);
        }
      } catch (err) {
        console.error(`Error cleaning up ${file}:`, err.message);
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error.message);
  }
};

module.exports = {
  generateIndividualCard,
  generateFamilyPack,
  saveCard,
  cleanupOldFiles
};