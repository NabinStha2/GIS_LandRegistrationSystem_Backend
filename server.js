require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const MainRouter = require("./routes/main.route");
const { SuccessCase, failCase } = require("./utils/requestHandler");
const { emailInitialSetup } = require("./utils/mail");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

emailInitialSetup();

connectDB(app);

app.use("*", (req, res, next) => {
  res.fail = failCase({ req, res });
  res.success = SuccessCase({ req, res });
  next();
});

app.use("/api", MainRouter);

// app.use("/", (req, res, next) => {
//   return res.success("", "Welcome to the GIS Land Registration System.");
// });

app.use("*", (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Api endpoint does not exist!",
  });
});
