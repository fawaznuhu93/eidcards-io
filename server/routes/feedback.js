const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Test endpoint to verify route is working
router.get('/feedback/stats', (req, res) => {
  res.json({ 
    success: true,
    message: 'Feedback system is active',
    endpoints: {
      submit: 'POST /api/feedback',
      stats: 'GET /api/feedback/stats'
    },
    timestamp: new Date().toISOString()
  });
});

// Main feedback submission endpoint
router.post('/feedback', async (req, res) => {
  console.log('📬 Feedback received:', req.body);
  
  try {
    const { name, email, phone, message, type, page } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email and message are required' 
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Send email to admin
    const info = await transporter.sendMail({
      from: `"EidCards.io Feedback" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'fawaznuhu93@gmail.com',
      subject: `📬 New Feedback from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #FFD700; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #B8860B; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✨ New Feedback Received</h2>
            </div>
            <div class="content">
              <div class="field"><span class="label">Name:</span> ${name}</div>
              <div class="field"><span class="label">Email:</span> ${email}</div>
              ${phone ? `<div class="field"><span class="label">Phone:</span> ${phone}</div>` : ''}
              <div class="field"><span class="label">Type:</span> ${type || 'General'}</div>
              <div class="field"><span class="label">Page:</span> ${page || 'Unknown'}</div>
              <div class="field"><span class="label">Message:</span></div>
              <div style="background: white; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Feedback email sent:', info.messageId);
    
    // Send auto-response to user
    try {
      await transporter.sendMail({
        from: `"EidCards.io" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🙏 Thank you for your feedback!',
        html: `
          <div style="font-family: Arial; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #FFD700;">JazakAllah Khair!</h2>
            <p>Dear ${name},</p>
            <p>Thank you for taking the time to share your feedback with us. We truly appreciate your input and will review it carefully.</p>
            <p>Your feedback reference: <strong>${Date.now()}</strong></p>
            <p>May Allah bless you,</p>
            <p><strong>The EidCards.io Team</strong></p>
          </div>
        `
      });
      console.log('✅ Auto-response sent to:', email);
    } catch (autoError) {
      console.error('Auto-response failed:', autoError.message);
      // Don't fail the whole request if auto-response fails
    }
    
    res.json({ 
      success: true, 
      message: 'Feedback sent successfully. JazakAllah Khair!' 
    });
    
  } catch (error) {
    console.error('❌ Feedback error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send feedback' 
    });
  }
});

module.exports = router;