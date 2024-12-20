const jwt = require('jsonwebtoken');

const jwtGenerator = (user, time) => {
  const payload = {
    user,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: time });
};

module.exports = jwtGenerator;
