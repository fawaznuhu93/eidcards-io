const axios = require('axios');

// Verify payment with Paystack
const verifyPayment = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('❌ Paystack verification error:', error.response?.data || error.message);
    throw error;
  }
};

// Initialize transaction (if needed)
const initializeTransaction = async (data) => {
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: data.email,
        amount: data.amount,
        currency: data.currency || 'USD',
        reference: data.reference,
        metadata: data.metadata,
        callback_url: `${process.env.FRONTEND_URL}/verify`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('❌ Paystack initialization error:', error.response?.data || error.message);
    throw error;
  }
};

// Get transaction details
const getTransaction = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('❌ Paystack fetch error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  verifyPayment,
  initializeTransaction,
  getTransaction
};