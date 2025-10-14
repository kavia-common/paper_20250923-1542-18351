const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { handleSignup, handleLogin, handleRefresh, handleLogout } = require('./auth.controller');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Validators
const emailValidator = body('email').isEmail().withMessage('Valid email is required');
const passwordValidator = body('password')
  .isString()
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');
const nameValidator = body('name').optional().isString().isLength({ min: 1, max: 100 });
const refreshTokenValidator = body('refreshToken').isString().withMessage('refreshToken is required');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

router.post('/signup', authLimiter, [emailValidator, passwordValidator, nameValidator], handleSignup);
router.post('/login', authLimiter, [emailValidator, passwordValidator], handleLogin);
router.post('/refresh', [refreshTokenValidator], handleRefresh);
router.post('/logout', [refreshTokenValidator], handleLogout);

module.exports = router;
