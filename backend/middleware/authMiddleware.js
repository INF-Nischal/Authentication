const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.JWT;
        const decoded = jwt.verify(token, process.env.SECRET);

        const user = await User.findById(decoded.id);
        if(!user) {
            res.status(401).json({ error: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized.' });
        console.error(error);
    }
}

module.exports = verifyToken;