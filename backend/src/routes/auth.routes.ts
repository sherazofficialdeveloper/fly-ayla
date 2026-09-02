import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rateLimit.middleware';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new customer account
 * @access  Public
 */
router.post('/register', rateLimit(10, 60000), AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Sign in user & return tokens
 * @access  Public
 */
router.post('/login', rateLimit(15, 60000), AuthController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh', AuthController.refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user & revoke refresh token
 * @access  Public
 */
router.post('/logout', AuthController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user info
 * @access  Private
 */
router.get('/me', authenticate, AuthController.me);
router.get('/profile', authenticate, UserController.getMe);
router.put('/profile', authenticate, UserController.updateMe);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post('/forgot-password', rateLimit(5, 60000), AuthController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', rateLimit(5, 60000), AuthController.resetPassword);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password while logged in
 * @access  Private
 */
router.post('/change-password', authenticate, AuthController.changePassword);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email token
 * @access  Public
 */
router.post('/verify-email', AuthController.verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Private
 */
router.post('/resend-verification', authenticate, AuthController.resendVerification);

export const authRoutes = router;
