const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // Helps with some email providers
    }
  });
};

// Send feedback email
const sendFeedbackEmail = async (feedbackData) => {
  const transporter = createTransporter();
  
  const { name, email, phone, message, type, page } = feedbackData;
  
  const mailOptions = {
    from: `"EidCards.io Feedback" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || 'fawaznuhu93@gmail.com',
    replyTo: email,
    subject: `📬 New Feedback from ${name} - ${type}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD700, #FDB931); padding: 20px; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #B8860B; }
          .value { background: white; padding: 8px; border-radius: 5px; margin-top: 3px; }
          .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #FFD700; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ New Feedback Received ✨</h1>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">📋 Feedback Type:</div>
              <div class="value">${type || 'General Feedback'}</div>
            </div>
            
            <div class="field">
              <div class="label">👤 From:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value">${email}</div>
            </div>
            
            ${phone ? `
            <div class="field">
              <div class="label">📞 Phone:</div>
              <div class="value">${phone}</div>
            </div>
            ` : ''}
            
            ${page ? `
            <div class="field">
              <div class="label">📍 Page:</div>
              <div class="value">${page}</div>
            </div>
            ` : ''}
            
            <hr>
            
            <div class="label">💬 Message:</div>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <hr>
            
            <div class="field">
              <div class="label">🕐 Submitted:</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} EidCards.io - All rights reserved.</p>
            <p>This is an automated message from your feedback system.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    
    // Plain text version for email clients that don't support HTML
    text: `
      New Feedback Received
      =====================
      
      Type: ${type || 'General Feedback'}
      From: ${name}
      Email: ${email}
      ${phone ? `Phone: ${phone}` : ''}
      ${page ? `Page: ${page}` : ''}
      
      Message:
      ${message}
      
      Submitted: ${new Date().toLocaleString()}
      
      ---
      EidCards.io Feedback System
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Feedback email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send feedback email:', error);
    throw error;
  }
};

// Send auto-response to user (optional)
const sendAutoResponse = async (feedbackData) => {
  const transporter = createTransporter();
  
  const { name, email, type } = feedbackData;
  
  const mailOptions = {
    from: `"EidCards.io" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🙏 Thank you for your feedback!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD700, #FDB931); padding: 20px; border-radius: 10px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 20px; background: #f9f9f9; border-radius: 10px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ JazakAllah Khair! ✨</h1>
          </div>
          
          <div class="content">
            <p>Assalamu Alaikum ${name},</p>
            
            <p>Thank you for taking the time to share your feedback with us. We truly appreciate your input and will review it carefully to improve our service.</p>
            
            <p>Your feedback reference: <strong>${type}-${Date.now()}</strong></p>
            
            <p>If you have any urgent matters, please don't hesitate to reach out to us directly at <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a>.</p>
            
            <p style="margin-top: 30px;">May Allah bless you and your family,</p>
            <p><strong>The EidCards.io Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} EidCards.io</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Auto-response sent to:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send auto-response:', error);
    // Don't throw - this is optional
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendFeedbackEmail,
  sendAutoResponse
};