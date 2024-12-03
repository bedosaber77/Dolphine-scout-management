const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token not found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized - Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = authorization;
