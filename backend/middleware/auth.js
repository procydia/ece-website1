const jwt = require("jsonwebtoken");
const config = require("config");

if (!config.get("jwtSecret")) {
  throw new Error("jwtSecret is not set in the config");
}

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token") || req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Use the same secret key used for signing the token
    req.vendor = decoded.vendor; // Ensure vendor ID is stored in decoded.vendor
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authenticateToken;
