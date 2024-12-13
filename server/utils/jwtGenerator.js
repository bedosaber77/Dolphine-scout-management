const jwt = require('jsonwebtoken');

const jwtGenerator = ({ User_ID, role }, time) => {
  const payload = {
    user: {
      id: User_ID,
      role,
    },
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: time });
};

module.exports = jwtGenerator;
