const express = require("express");
const {
  validateRegister,
  validateLogin,
  validateUpdatePassword,
} = require("../middlewares/Validate");
const authController = require("../controllers/authController");
const Router = express.Router();

Router.get("/", (req, res) => {
  res.send("Auth route");
});

Router.post("/register", validateRegister, authController.register);

Router.post("/login", validateLogin, authController.login);
Router.put(
  "/updatePassword",
  validateUpdatePassword,
  authController.updatePassword
);
Router.post("/refreshToken", authController.refreshToken);
Router.post("/logout", authController.logout);
module.exports = Router;
