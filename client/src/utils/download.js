// Auto-download utility
export const triggerDownload = async (cardData) => {
  // In production, this would call your backend to generate the image
  // For now, we'll simulate a download
  
  const { product_id, senderName, message, reference } = cardData;
  
  // Create a canvas element to generate the card
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set dimensions (for a card)
  canvas.width = 1200;
  canvas.height = 1600;
  
  // Draw background (in production, this would be your actual card design)
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add Islamic pattern
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  for (let i = 0; i < canvas.width; i += 100) {
    for (let j = 0; j < canvas.height; j += 100) {
      ctx.beginPath();
      ctx.arc(i, j, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Draw sender name (top right)
  ctx.font = 'bold 48px "Amiri", serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'right';
  ctx.fillText(senderName, canvas.width - 100, 150);
  
  // Draw message (center)
  ctx.font = '64px "Amiri", serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 10;
  
  // Wrap text
  const words = message.split(' ');
  let line = '';
  let y = canvas.height / 2;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > 800 && i > 0) {
      ctx.fillText(line, canvas.width / 2, y);
      line = words[i] + ' ';
      y += 80;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, canvas.width / 2, y);
  
  // Convert to blob and download
  canvas.toBlob((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EidCard_${reference}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 'image/png');
  
  // Store in localStorage for redownload
  const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
  downloads.push({
    reference,
    product_id,
    timestamp: Date.now(),
    url: 'generated' // In production, store the actual URL or data
  });
  localStorage.setItem('downloads', JSON.stringify(downloads));
};

// Redownload function
export const redownloadCard = (reference, format = 'png') => {
  const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
  const download = downloads.find(d => d.reference === reference);
  
  if (download) {
    // In production, fetch the stored image or regenerate
    alert('In production, this would redownload your card in ' + format + ' format');
  }
};   