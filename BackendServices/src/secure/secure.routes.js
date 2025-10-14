const express = require('express');
const { verifyAccess } = require('../auth/auth.middleware');

const router = express.Router();

/**
 * Protected health check
 */
router.get('/health', verifyAccess, (req, res) => {
  return res.status(200).json({ status: 'ok', user: { id: req.user.id, email: req.user.email } });
});

module.exports = router;
