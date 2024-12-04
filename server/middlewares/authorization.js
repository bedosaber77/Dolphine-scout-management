const jwt = require("jsonwebtoken");
const jwtGenerator = require("../utils/jwtGenerator");

const authorization = (req, res, next) => {
  const token = req.headers.accesstoken;
  console.log(req.headers, token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token not found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
  } catch (error) {
    console.error("Error verifying token", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
  next();
};

module.exports = authorization;
