require('dotenv').config()
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'reden';
const JWT_EXPIRATION = '1h'; // Token expiration time

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
};

// Function to verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
