const express = require("express");
const { validateRegister, validateLogin } = require("../middlewares/Validate");
const authController = require("../controllers/authController");
const Router = express.Router();

Router.get("/", (req, res) => {
  res.send("Auth route");
});

Router.post("/register", validateRegister, authController.register);

Router.post("/login", validateLogin, authController.login);
module.exports = Router;
