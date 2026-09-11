const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ userId: user._id.toString(), name: user.name }, process.env.SECRET_KEY, { expiresIn: '24h' });
            res.json({ accessToken: accessToken });
        } else {
            res.status(401).json({ message: 'Password salah. Akses ditolak.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;