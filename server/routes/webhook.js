const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { sendPaymentConfirmation, sendAdminNotification } = require('../utils/email');
const { generateIndividualCard, generateFamilyPack, saveCard } = require('../utils/cardGenerator');
const { getExpectedAmount } = require('../constants/prices');

// Paystack webhook endpoint - NO RATE LIMITING!
router.post('/paystack', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Get signature from headers
    const signature = req.headers['x-paystack-signature'];
    
    if (!signature) {
      console.error('❌ No signature provided');
      return res.status(401).send('No signature');
    }
    
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest('hex');
    
    if (hash !== signature) {
      console.error('❌ Invalid webhook signature');
      return res.status(401).send('Invalid signature');
    }
    
    // Parse event
    const event = JSON.parse(req.body);
    console.log('✅ Webhook received:', event.event);
    
    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        const transaction = event.data;
        const metadata = transaction.metadata || {};
        
        console.log('💰 Payment successful:', {
          reference: transaction.reference,
          amount: transaction.amount / 100,
          currency: transaction.currency,
          email: transaction.customer.email,
          product: metadata.product_name
        });
        
        // 🔴 CRITICAL: Validate amount
        const expectedAmount = getExpectedAmount(metadata.product_id, metadata.product_type);
        
        if (transaction.amount !== expectedAmount) {
          console.error('🚨 WEBHOOK: Amount mismatch!', {
            expected: expectedAmount,
            received: transaction.amount,
            reference: transaction.reference
          });
          // Still acknowledge receipt but log fraud
        } else {
          // Generate cards (async, don't wait)
          setTimeout(async () => {
            try {
              if (metadata.product_type === 'family') {
                const cards = metadata.family_cards || [];
                const buffers = await generateFamilyPack({
                  cards,
                  productId: metadata.product_id,
                  reference: transaction.reference
                });
                
                for (let i = 0; i < buffers.length; i++) {
                  const filename = `${transaction.reference}_${i}.png`;
                  await saveCard(buffers[i], filename);
                }
              } else {
                const buffer = await generateIndividualCard({
                  productId: metadata.product_id,
                  senderName: metadata.sender_name,
                  recipientName: metadata.recipient_name,
                  message: metadata.message,
                  reference: transaction.reference
                });
                
                await saveCard(buffer, `${transaction.reference}.png`);
              }
              
              // Send emails
              await sendPaymentConfirmation(transaction);
              await sendAdminNotification(transaction);
              
            } catch (genError) {
              console.error('❌ Card generation failed:', genError);
            }
          }, 0);
        }
        
        break;
        
      case 'charge.failed':
        console.log('❌ Payment failed:', event.data.reference);
        break;
        
      case 'transfer.success':
        console.log('💰 Transfer success:', event.data.reference);
        break;
        
      default:
        console.log('Unhandled event type:', event.event);
    }
    
    // Always acknowledge receipt
    res.sendStatus(200);
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).send('Webhook processing failed');
  }
});

module.exports = router;