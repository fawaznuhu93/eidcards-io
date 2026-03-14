const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { generateIndividualCard } = require('../utils/cardGenerator');

// Regenerate expired card
router.post('/regenerate/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    console.log(`🔄 Regenerating card: ${reference}`);
    
    // For now, return a success message
    // You'll need to implement actual regeneration logic
    res.json({ 
      success: true, 
      message: 'Card regeneration endpoint - implementation pending' 
    });
    
  } catch (error) {
    console.error('Regeneration error:', error);
    res.status(500).json({ error: 'Failed to regenerate card' });
  }
});

// Get available formats
router.get('/formats/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    const tempDir = path.join(__dirname, '../temp');
    
    // Check if directory exists
    try {
      await fs.access(tempDir);
    } catch {
      return res.json({ formats: [] });
    }
    
    const files = await fs.readdir(tempDir);
    const formats = [];
    
    ['png', 'jpg', 'pdf', 'svg', 'html'].forEach(format => {
      if (files.includes(`${reference}.${format}`)) {
        formats.push(format);
      }
    });
    
    res.json({ formats, reference });
    
  } catch (error) {
    console.error('Formats check error:', error);
    res.status(500).json({ error: 'Failed to check formats' });
  }
});

// Download specific format
router.get('/download/:reference/:format', async (req, res) => {
  try {
    const { reference, format } = req.params;
    const filepath = path.join(__dirname, '../temp', `${reference}.${format}`);
    
    // Check if file exists
    try {
      await fs.access(filepath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.download(filepath);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

module.exports = router;