const jwt = require('jsonwebtoken');
require("dotenv").config()

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;


  try {
    // Verify token
    const decoded = jwt.verify(req.cookies.verification_token, process.env.JWT_SECRET);
    console.log("verified")
    // Attach user data to request object
    req.user = decoded;
    
    next(); // Continue to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = auth;