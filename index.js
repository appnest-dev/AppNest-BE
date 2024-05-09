require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./config/db");

const httpStatusText = require("./utils/httpStatusText");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

const projectsRouter = require("./routes/projects.route");

app.use("/api/projects", projectsRouter);

app.all("*", (_req, res, _next) => {
  return res.status(404).json({
    status: httpStatusText.FAIL,
    message: "this resource is not available",
  });
});

// global error handler
app.use((error, _req, res, _next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
