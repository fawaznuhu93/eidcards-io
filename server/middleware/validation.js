const { getExpectedAmount } = require('../constants/prices');

// Validate payment amount against backend constants
const validatePaymentAmount = (productId, productType, paidAmount) => {
  const expectedAmount = getExpectedAmount(productId, productType);
  
  if (!expectedAmount) {
    return {
      valid: false,
      error: 'Unknown product',
      code: 'UNKNOWN_PRODUCT'
    };
  }
  
  if (paidAmount !== expectedAmount) {
    return {
      valid: false,
      error: 'Amount mismatch',
      code: 'AMOUNT_MISMATCH',
      expected: expectedAmount,
      received: paidAmount
    };
  }
  
  return { valid: true };
};

// Validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate reference format
const validateReference = (reference) => {
  // Paystack references start with ref_ or are alphanumeric
  const re = /^[a-zA-Z0-9_-]+$/;
  return re.test(reference) && reference.length >= 5 && reference.length <= 100;
};

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .substring(0, 500); // Limit length
};

module.exports = {
  validatePaymentAmount,
  validateEmail,
  validateReference,
  sanitizeInput
};