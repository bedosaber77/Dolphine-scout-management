const jwt = require("jsonwebtoken");

const jwtGenerator = (user_id) => {
  const payload = {
    user: {
      id: user_id,
    },
  };
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
};

module.exports = jwtGenerator;
