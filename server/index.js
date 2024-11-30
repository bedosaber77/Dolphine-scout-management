const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/DBmanager");
const app = express();
const apiRouter = require("./routes/api");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));
db.connect();

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
