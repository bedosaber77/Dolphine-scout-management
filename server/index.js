const express = require("express");
require("dotenv").config();
const db = require("./config/DBmanager");
const app = express();

db.connect();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
