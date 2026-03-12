const express = require('express');
const router = express.Router();
const { verifyLimiter } = require('../middleware/rateLimit');
const { handleVerification, handleDownload } = require('../controllers/paymentController');

// Verify payment - STRICT rate limiting
router.get('/verify/:reference', verifyLimiter, handleVerification);

// Download generated card
router.get('/download/:filename', handleDownload);

module.exports = router;