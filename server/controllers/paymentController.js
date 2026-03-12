const { verifyPayment } = require('../utils/paystack');
const { validatePaymentAmount, validateReference } = require('../middleware/validation');
const { sendPaymentConfirmation, sendAdminNotification } = require('../utils/email');
const { generateIndividualCard, generateFamilyPack, saveCard } = require('../utils/cardGenerator');
const { getExpectedAmount } = require('../constants/prices');
const path = require('path');
const fs = require('fs');

// Verify payment and generate card
const handleVerification = async (req, res) => {
  try {
    const { reference } = req.params;
    
    // Validate reference format
    if (!validateReference(reference)) {
      return res.status(400).json({
        verified: false,
        error: 'Invalid reference format',
        code: 'INVALID_REFERENCE'
      });
    }
    
    console.log(`🔍 Verifying payment: ${reference}`);
    
    // Verify with Paystack
    const paystackResponse = await verifyPayment(reference);
    
    if (!paystackResponse.status || paystackResponse.data.status !== 'success') {
      return res.status(400).json({
        verified: false,
        error: 'Payment not successful',
        code: 'PAYMENT_NOT_SUCCESSFUL'
      });
    }
    
    const transaction = paystackResponse.data;
    const metadata = transaction.metadata || {};
    const productId = metadata.product_id;
    const productType = metadata.product_type;
    
    // 🔴 CRITICAL: Validate amount against backend constants
    const expectedAmount = getExpectedAmount(productId, productType);
    
    if (!expectedAmount) {
      console.error('❌ Unknown product:', { productId, productType });
      return res.status(400).json({
        verified: false,
        error: 'Unknown product',
        code: 'UNKNOWN_PRODUCT'
      });
    }
    
    if (transaction.amount !== expectedAmount) {
      console.error('🚨 AMOUNT MISMATCH DETECTED!', {
        expected: expectedAmount,
        received: transaction.amount,
        productId,
        productType,
        reference,
        frontendPrice: metadata.price // Log for audit
      });
      
      // Log potential fraud
      console.warn('⚠️ FRAUD ALERT:', {
        ip: req.ip,
        reference,
        productId,
        attemptedAmount: transaction.amount,
        expectedAmount
      });
      
      return res.status(400).json({
        verified: false,
        error: 'Invalid payment amount',
        code: 'AMOUNT_MISMATCH'
      });
    }
    
    console.log('✅ Payment verified:', {
      reference,
      product: metadata.product_name,
      amount: transaction.amount / 100,
      customer: transaction.customer.email
    });
    
    // Generate card based on type
    let cardBuffers = [];
    let filenames = [];
    
    if (productType === 'family') {
      // Generate family pack
      const cards = metadata.family_cards || [];
      cardBuffers = await generateFamilyPack({
        cards,
        productId,
        reference
      });
      
      // Save each card
      for (let i = 0; i < cardBuffers.length; i++) {
        const filename = `${reference}_${i}.png`;
        await saveCard(cardBuffers[i], filename);
        filenames.push(filename);
      }
    } else {
      // Generate individual or video card
      const cardData = {
        productId,
        senderName: metadata.sender_name,
        recipientName: metadata.recipient_name,
        message: metadata.message,
        reference
      };
      
      const buffer = await generateIndividualCard(cardData);
      const filename = `${reference}.png`;
      await saveCard(buffer, filename);
      filenames = [filename];
    }
    
    // Send email confirmation
    await sendPaymentConfirmation(transaction);
    await sendAdminNotification(transaction);
    
    // Return success response
    res.json({
      verified: true,
      transaction: {
        reference: transaction.reference,
        amount: transaction.amount / 100,
        currency: transaction.currency,
        status: transaction.status,
        paidAt: transaction.paid_at,
        customer: {
          email: transaction.customer.email
        },
        metadata: {
          product_id: metadata.product_id,
          product_name: metadata.product_name,
          product_type: metadata.product_type,
          sender_name: metadata.sender_name,
          recipient_name: metadata.recipient_name
        }
      },
      downloadUrls: filenames.map(f => `/api/download/${f}`)
    });
    
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({
      verified: false,
      error: 'Verification failed',
      code: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Handle download
const handleDownload = async (req, res) => {
  try {
    const { filename } = req.params;
    const { reference } = req.query;
    
    // Security: Validate filename
    if (!filename.match(/^[a-zA-Z0-9_-]+\.png$/)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    const filepath = path.join(__dirname, '../temp', filename);
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found or expired' });
    }
    
    // Send file
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      
      // Don't delete immediately - let cleanup job handle it
    });
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
};

module.exports = {
  handleVerification,
  handleDownload
};