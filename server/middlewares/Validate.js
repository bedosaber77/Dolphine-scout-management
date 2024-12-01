const validate = require("validator");
const db = require("../config/DBmanager");

const validateRegister = async (req, res, next) => {
  const { email, Fname, Lname, password, PhoneNum } = req.body;
  if (!email || !Fname || !Lname || !password || !PhoneNum) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const query = `SELECT * FROM "User" WHERE "email" = $1`;
    const params = [email];
    const result = await db.query(query, params);
    if (result.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  if (!validate.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (!validate.isAlpha(Fname) || !validate.isAlpha(Lname)) {
    return res
      .status(400)
      .json({ message: "First name and last name must be alphabets" });
  }
  if (!validate.isMobilePhone(PhoneNum)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }
  if (!validate.isStrongPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    });
  }
  next();
};
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validate.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  next();
};

const validateAchivement = (req, res, next) => {
  const { name, level } = req.body;
  if (!name && level && level <= 0) {
    return res.status(400).json({ message: "achievement name is required, level must be greater than 0" });
  }
  if (!name) {
    return res.status(400).json({ message: "achievement name is required" });
  }
  if (level && level <= 0) {
    return res.status(400).json({ message: "level must be greater than 0" });
  }
  next();
};

const validateLocation = (req, res, next) => {
  const { name, link } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Location name is required" });
  }
  if (link && !validate.isURL(link)) {
    return res.status(400).json({ message: "Invalid location" });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateAchivement,
  validateLocation,
};
