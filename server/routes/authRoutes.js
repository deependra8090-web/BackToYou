const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/google-oauth', authController.googleOAuth);
router.post('/switch-role', authController.switchRole);
router.post('/update-avatar', authController.updateAvatar);

module.exports = router;
