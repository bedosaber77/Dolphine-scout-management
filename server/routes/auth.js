const express = require("express");
const bcrypt = require("bcrypt");
const { validateRegister } = require("../middlewares/Validate");
const db = require("../config/DBmanager");
const Router = express.Router();

Router.get("/", (req, res) => {
  res.send("Auth route");
});

Router.post("/register", validateRegister, async (req, res) => {
  const { email, Fname, Lname, password, PhoneNum } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO "User" ("email", "Fname", "Lname", "password", "Phonenum") VALUES ($1, $2, $3, $4, $5)`;
    const params = [email, Fname, Lname, hashedPassword, PhoneNum];
    const result = await db.query(query, params);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

Router.post("/login", (req, res) => {
  res.send("Login route");
});
module.exports = Router;
