const { verifyToken } = require('../services/authService');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Add user info to request object
    next();
  } catch (err) {
    res.status(401).send('Invalid token.');
  }
};

module.exports = authenticate;
