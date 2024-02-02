const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided' });
  }

  try {
      const res = jwt.verify(token, process.env.JWT_SECRET);
      req.user = res;
      next();
  } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
