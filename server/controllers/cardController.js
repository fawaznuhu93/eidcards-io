const { generateIndividualCard } = require('../utils/cardGenerator');
const { validateEmail, sanitizeInput } = require('../middleware/validation');

// Generate preview card (no payment required)
const generatePreview = async (req, res) => {
  try {
    const { productId, senderName, recipientName, message } = req.body;
    
    // Sanitize inputs
    const cleanSenderName = sanitizeInput(senderName || 'Your Name');
    const cleanRecipientName = sanitizeInput(recipientName || '');
    const cleanMessage = sanitizeInput(message || 'Eid Mubarak!');
    
    // Generate card
    const buffer = await generateIndividualCard({
      productId,
      senderName: cleanSenderName,
      recipientName: cleanRecipientName,
      message: cleanMessage,
      reference: 'preview'
    });
    
    // Return as PNG
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(buffer);
    
  } catch (error) {
    console.error('Preview generation error:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
};

// Health check
const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
};

module.exports = {
  generatePreview,
  healthCheck
};