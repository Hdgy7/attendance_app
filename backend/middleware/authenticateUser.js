const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'];

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // If the token exists, remove 'Bearer ' part (if any) and verify it
  const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded; // Make user info available in route handler
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
