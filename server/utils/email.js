const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send payment confirmation email
const sendPaymentConfirmation = async (transaction) => {
  const transporter = createTransporter();
  
  const { customer, metadata, reference, amount, currency } = transaction;
  
  const downloadLink = `${process.env.FRONTEND_URL}/download?reference=${reference}`;
  
  const mailOptions = {
    from: `"EidCards.io" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: '🎉 Your Eid Card is Ready!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD700, #FDB931); padding: 20px; text-align: center; border-radius: 10px; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 20px; background: #f9f9f9; border-radius: 10px; margin-top: 20px; }
          .button { display: inline-block; padding: 12px 30px; background: #FFD700; color: #333; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Eid Mubarak! ✨</h1>
          </div>
          
          <div class="content">
            <h2>Your personalized Eid card is ready!</h2>
            
            <p>Assalamu Alaikum ${metadata.sender_name || 'Valued Customer'},</p>
            
            <p>Thank you for your purchase! Your beautiful Eid card has been generated and is ready to download.</p>
            
            <div class="details">
              <h3>📋 Order Details:</h3>
              <p><strong>Product:</strong> ${metadata.product_name}</p>
              <p><strong>Amount:</strong> ${currency} ${amount / 100}</p>
              <p><strong>Reference:</strong> ${reference}</p>
              ${metadata.recipient_name ? `<p><strong>To:</strong> ${metadata.recipient_name}</p>` : ''}
              ${metadata.message ? `<p><strong>Message:</strong> "${metadata.message}"</p>` : ''}
            </div>
            
            <div style="text-align: center;">
              <a href="${downloadLink}" class="button">📥 Download Your Card</a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              This link will expire in 24 hours for security reasons. 
              Please download your card as soon as possible.
            </p>
            
            <p>May Allah accept your good deeds and bless you and your family this Eid.</p>
            
            <p>JazakAllah Khair,<br>EidCards.io Team</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} EidCards.io. All rights reserved.</p>
            <p>You received this email because you made a purchase on our platform.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${customer.email}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

// Send admin notification
const sendAdminNotification = async (transaction) => {
  const transporter = createTransporter();
  
  const { customer, metadata, reference, amount } = transaction;
  
  const mailOptions = {
    from: `"EidCards.io System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: '💰 New Purchase Alert!',
    html: `
      <h2>New Purchase</h2>
      <p><strong>Product:</strong> ${metadata.product_name}</p>
      <p><strong>Amount:</strong> $${amount / 100}</p>
      <p><strong>Customer:</strong> ${customer.email}</p>
      <p><strong>Name:</strong> ${metadata.sender_name}</p>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Admin notification failed:', error);
  }
};

module.exports = {
  sendPaymentConfirmation,
  sendAdminNotification
};