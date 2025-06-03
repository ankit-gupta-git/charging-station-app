const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Assuming userModel is imported from the models directory
        const user = await userModel.create({ name, email, password });
        const token = user.generateAuthToken();
        res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = router;